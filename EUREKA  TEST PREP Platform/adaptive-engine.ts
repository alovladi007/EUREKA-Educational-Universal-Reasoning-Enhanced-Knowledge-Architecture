/**
 * EUREKA Test Prep - Advanced IRT Adaptive Engine
 * Implements 3PL Item Response Theory with Bayesian ability estimation
 */

import { Injectable } from '@nestjs/common';
import * as math from 'mathjs';

interface IRTParameters {
  a: number; // Discrimination
  b: number; // Difficulty  
  c: number; // Guessing
}

interface ResponseHistory {
  itemId: string;
  response: boolean;
  irtParams: IRTParameters;
  timeSpent: number;
}

interface AdaptiveState {
  theta: number;          // Ability estimate
  thetaSE: number;        // Standard error
  responses: ResponseHistory[];
  information: number[];  // Fisher information
  questionsAnswered: number;
}

@Injectable()
export class AdaptiveEngine {
  private readonly MIN_THETA = -3;
  private readonly MAX_THETA = 3;
  private readonly D = 1.7; // Scaling constant
  
  /**
   * Calculate probability of correct response using 3PL model
   */
  calculateProbability(theta: number, params: IRTParameters): number {
    const { a, b, c } = params;
    const exp = Math.exp(this.D * a * (theta - b));
    return c + (1 - c) / (1 + 1 / exp);
  }

  /**
   * Calculate Fisher Information for an item at given theta
   */
  calculateInformation(theta: number, params: IRTParameters): number {
    const { a, c } = params;
    const P = this.calculateProbability(theta, params);
    const Q = 1 - P;
    const numerator = Math.pow(a, 2) * Q;
    const denominator = P * Math.pow(1 - c, 2);
    return (numerator / denominator) * Math.pow(P - c, 2);
  }

  /**
   * Select next question using Maximum Fisher Information
   */
  selectNextQuestion(state: AdaptiveState, itemBank: any[]): any {
    const currentTheta = state.theta;
    let maxInfo = -1;
    let selectedItem = null;
    
    // Find item that maximizes information at current theta
    for (const item of itemBank) {
      // Skip already answered items
      if (state.responses.some(r => r.itemId === item.id)) {
        continue;
      }
      
      const info = this.calculateInformation(currentTheta, {
        a: item.irtA,
        b: item.irtB,
        c: item.irtC
      });
      
      // Add content balancing weight
      const topicWeight = this.calculateTopicWeight(item.topicId, state);
      const weightedInfo = info * topicWeight;
      
      if (weightedInfo > maxInfo) {
        maxInfo = weightedInfo;
        selectedItem = item;
      }
    }
    
    return selectedItem;
  }

  /**
   * Update ability estimate using Expected A Posteriori (EAP)
   */
  updateTheta(state: AdaptiveState, response: boolean, itemParams: IRTParameters): AdaptiveState {
    const gridPoints = 61; // Number of quadrature points
    const grid = this.generateQuadratureGrid(gridPoints);
    
    // Prior: Normal(0, 1)
    const prior = grid.map(point => this.normalPDF(point, 0, 1));
    
    // Likelihood for all responses
    const likelihood = grid.map(theta => {
      let L = 1;
      
      // Include all previous responses
      for (const resp of state.responses) {
        const P = this.calculateProbability(theta, resp.irtParams);
        L *= resp.response ? P : (1 - P);
      }
      
      // Include current response
      const P = this.calculateProbability(theta, itemParams);
      L *= response ? P : (1 - P);
      
      return L;
    });
    
    // Posterior = Prior × Likelihood
    const posterior = grid.map((_, i) => prior[i] * likelihood[i]);
    const posteriorSum = posterior.reduce((a, b) => a + b, 0);
    const normalizedPosterior = posterior.map(p => p / posteriorSum);
    
    // EAP estimate
    const newTheta = grid.reduce((sum, theta, i) => 
      sum + theta * normalizedPosterior[i], 0
    );
    
    // Standard Error
    const variance = grid.reduce((sum, theta, i) => 
      sum + Math.pow(theta - newTheta, 2) * normalizedPosterior[i], 0
    );
    const newSE = Math.sqrt(variance);
    
    // Update state
    return {
      ...state,
      theta: Math.max(this.MIN_THETA, Math.min(this.MAX_THETA, newTheta)),
      thetaSE: newSE,
      responses: [...state.responses, {
        itemId: '',
        response,
        irtParams: itemParams,
        timeSpent: 0
      }],
      questionsAnswered: state.questionsAnswered + 1
    };
  }

  /**
   * Calculate stopping criteria
   */
  shouldStop(state: AdaptiveState): boolean {
    // Stop if SE < threshold or max questions reached
    return state.thetaSE < 0.3 || state.questionsAnswered >= 50;
  }

  /**
   * Calculate topic weight for content balancing
   */
  private calculateTopicWeight(topicId: string, state: AdaptiveState): number {
    const topicCounts = new Map<string, number>();
    
    state.responses.forEach(r => {
      const count = topicCounts.get(topicId) || 0;
      topicCounts.set(topicId, count + 1);
    });
    
    const count = topicCounts.get(topicId) || 0;
    // Reduce weight if topic is over-represented
    return 1 / (1 + count * 0.1);
  }

  /**
   * Generate quadrature grid for numerical integration
   */
  private generateQuadratureGrid(points: number): number[] {
    const grid: number[] = [];
    const min = -4;
    const max = 4;
    const step = (max - min) / (points - 1);
    
    for (let i = 0; i < points; i++) {
      grid.push(min + i * step);
    }
    
    return grid;
  }

  /**
   * Normal probability density function
   */
  private normalPDF(x: number, mean: number, sd: number): number {
    const variance = Math.pow(sd, 2);
    const exp = Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    return exp / Math.sqrt(2 * Math.PI * variance);
  }

  /**
   * Calculate mastery probability using Bayesian Knowledge Tracing
   */
  calculateMastery(responses: ResponseHistory[], topicId: string): number {
    // BKT parameters
    let pL = 0.1;  // P(Learned)
    const pT = 0.1;  // P(Transit)
    const pG = 0.25; // P(Guess)
    const pS = 0.1;  // P(Slip)
    
    const topicResponses = responses.filter(r => r.itemId.includes(topicId));
    
    for (const resp of topicResponses) {
      const pCorrect = pL * (1 - pS) + (1 - pL) * pG;
      
      if (resp.response) {
        // Update after correct response
        pL = (pL * (1 - pS)) / pCorrect;
      } else {
        // Update after incorrect response
        pL = (pL * pS) / (1 - pCorrect);
      }
      
      // Learning transition
      pL = pL + (1 - pL) * pT;
    }
    
    return pL;
  }
}

export class AdaptiveController {
  constructor(private readonly engine: AdaptiveEngine) {}

  async getNextQuestion(sessionId: string): Promise<any> {
    // Get current state and item bank
    const state = await this.getSessionState(sessionId);
    const items = await this.getAvailableItems(state);
    
    // Select next question
    const nextItem = this.engine.selectNextQuestion(state, items);
    
    // Calculate metadata
    const probability = this.engine.calculateProbability(state.theta, {
      a: nextItem.irtA,
      b: nextItem.irtB,
      c: nextItem.irtC
    });
    
    return {
      item: nextItem,
      metadata: {
        expectedProbability: probability,
        currentTheta: state.theta,
        thetaSE: state.thetaSE,
        questionsAnswered: state.questionsAnswered,
        shouldStop: this.engine.shouldStop(state)
      }
    };
  }

  async submitResponse(sessionId: string, response: any): Promise<any> {
    const state = await this.getSessionState(sessionId);
    
    // Update ability estimate
    const newState = this.engine.updateTheta(state, response.isCorrect, {
      a: response.irtA,
      b: response.irtB,
      c: response.irtC
    });
    
    // Calculate mastery for topic
    const mastery = this.engine.calculateMastery(
      newState.responses,
      response.topicId
    );
    
    // Save updated state
    await this.saveSessionState(sessionId, newState);
    
    return {
      newTheta: newState.theta,
      thetaSE: newState.thetaSE,
      mastery,
      shouldStop: this.engine.shouldStop(newState)
    };
  }

  private async getSessionState(sessionId: string): Promise<AdaptiveState> {
    // Retrieve from database/cache
    return {
      theta: 0,
      thetaSE: 1,
      responses: [],
      information: [],
      questionsAnswered: 0
    };
  }

  private async saveSessionState(sessionId: string, state: AdaptiveState): Promise<void> {
    // Save to database/cache
  }

  private async getAvailableItems(state: AdaptiveState): Promise<any[]> {
    // Get items from database
    return [];
  }
}
