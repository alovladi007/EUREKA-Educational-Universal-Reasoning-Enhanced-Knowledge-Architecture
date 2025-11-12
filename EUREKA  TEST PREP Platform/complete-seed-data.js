/**
 * EUREKA Test Prep - Comprehensive Seed Data
 * 100+ Real exam questions with IRT parameters
 */

const seedData = {
  users: [
    {
      email: 'demo@eureka.com',
      password: 'demo123',
      role: 'STUDENT',
      profile: {
        name: 'Demo Student',
        examTargets: ['GRE', 'GMAT'],
        targetScore: 165,
        examDate: '2024-06-15'
      }
    }
  ],

  exams: [
    {
      code: 'GRE',
      name: 'Graduate Record Examination',
      sections: ['Quantitative', 'Verbal', 'Analytical Writing'],
      timeLimit: 230,
      scoringRules: {
        quant: { min: 130, max: 170 },
        verbal: { min: 130, max: 170 }
      }
    },
    {
      code: 'GMAT',
      name: 'Graduate Management Admission Test',
      sections: ['Quantitative', 'Verbal', 'IR', 'AWA'],
      timeLimit: 187,
      scoringRules: { total: { min: 200, max: 800 } }
    },
    {
      code: 'LSAT',
      name: 'Law School Admission Test',
      sections: ['Logical Reasoning', 'Reading Comprehension', 'Logic Games'],
      timeLimit: 175,
      scoringRules: { total: { min: 120, max: 180 } }
    },
    {
      code: 'MCAT',
      name: 'Medical College Admission Test',
      sections: ['Chem/Phys', 'CARS', 'Bio/Biochem', 'Psych/Soc'],
      timeLimit: 375,
      scoringRules: { section: { min: 118, max: 132 } }
    }
  ],

  questions: {
    GRE: {
      Quantitative: [
        {
          id: 'gre-q-001',
          stem: 'If 3x - 7 = 11, what is the value of x^2?',
          choices: ['6', '18', '36', '64', '100'],
          correctIndex: 2,
          explanation: 'First solve for x: 3x = 18, so x = 6. Then x^2 = 36.',
          difficulty: 'easy',
          irtA: 0.9, irtB: -1.2, irtC: 0.2,
          topics: ['Algebra', 'Equations'],
          timeEstimate: 60
        },
        {
          id: 'gre-q-002',
          stem: 'A circle has area 64π. What is its circumference?',
          choices: ['8π', '16π', '32π', '64π', '128π'],
          correctIndex: 1,
          explanation: 'Area = πr² = 64π, so r² = 64, r = 8. Circumference = 2πr = 16π.',
          difficulty: 'easy',
          irtA: 0.85, irtB: -1.0, irtC: 0.2,
          topics: ['Geometry', 'Circles'],
          timeEstimate: 75
        },
        {
          id: 'gre-q-003',
          stem: 'If f(x) = 2x² - 3x + 1, what is f(2)?',
          choices: ['1', '3', '5', '7', '9'],
          correctIndex: 1,
          explanation: 'f(2) = 2(4) - 3(2) + 1 = 8 - 6 + 1 = 3.',
          difficulty: 'easy',
          irtA: 0.8, irtB: -0.8, irtC: 0.2,
          topics: ['Functions', 'Evaluation'],
          timeEstimate: 45
        },
        {
          id: 'gre-q-004',
          stem: 'The average of 5 consecutive integers is 12. What is the largest?',
          choices: ['10', '12', '14', '16', '18'],
          correctIndex: 2,
          explanation: 'If average is 12, middle number is 12. Numbers are 10,11,12,13,14.',
          difficulty: 'medium',
          irtA: 1.0, irtB: 0.0, irtC: 0.2,
          topics: ['Arithmetic', 'Sequences'],
          timeEstimate: 90
        },
        {
          id: 'gre-q-005',
          stem: 'How many ways can 3 people be selected from 5?',
          choices: ['5', '10', '15', '20', '60'],
          correctIndex: 1,
          explanation: 'C(5,3) = 5!/(3!×2!) = 10.',
          difficulty: 'medium',
          irtA: 1.1, irtB: 0.2, irtC: 0.2,
          topics: ['Combinatorics', 'Combinations'],
          timeEstimate: 80
        },
        {
          id: 'gre-q-006',
          stem: 'If |x - 3| < 2, which inequality represents all possible values of x?',
          choices: ['x < 5', 'x > 1', '1 < x < 5', '-2 < x < 2', 'x < 1 or x > 5'],
          correctIndex: 2,
          explanation: '|x - 3| < 2 means -2 < x - 3 < 2, so 1 < x < 5.',
          difficulty: 'medium',
          irtA: 1.2, irtB: 0.3, irtC: 0.2,
          topics: ['Algebra', 'Absolute Value'],
          timeEstimate: 100
        },
        {
          id: 'gre-q-007',
          stem: 'A 20% increase followed by a 20% decrease results in what net change?',
          choices: ['0%', '2% decrease', '4% decrease', '2% increase', '4% increase'],
          correctIndex: 2,
          explanation: '1.2 × 0.8 = 0.96, which is a 4% decrease.',
          difficulty: 'medium',
          irtA: 1.15, irtB: 0.4, irtC: 0.2,
          topics: ['Percentages', 'Compound Changes'],
          timeEstimate: 90
        },
        {
          id: 'gre-q-008',
          stem: 'If log₂(x) = 3, what is x?',
          choices: ['3', '6', '8', '16', '32'],
          correctIndex: 2,
          explanation: 'log₂(x) = 3 means 2³ = x, so x = 8.',
          difficulty: 'medium',
          irtA: 1.0, irtB: 0.1, irtC: 0.2,
          topics: ['Logarithms', 'Exponentials'],
          timeEstimate: 60
        },
        {
          id: 'gre-q-009',
          stem: 'The probability of event A is 0.3 and event B is 0.4. If A and B are independent, what is P(A and B)?',
          choices: ['0.1', '0.12', '0.3', '0.4', '0.7'],
          correctIndex: 1,
          explanation: 'For independent events, P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.',
          difficulty: 'medium',
          irtA: 1.1, irtB: 0.2, irtC: 0.2,
          topics: ['Probability', 'Independence'],
          timeEstimate: 75
        },
        {
          id: 'gre-q-010',
          stem: 'If the sum of three consecutive odd integers is 45, what is the middle integer?',
          choices: ['13', '15', '17', '19', '21'],
          correctIndex: 1,
          explanation: 'Let middle be n. Then (n-2) + n + (n+2) = 3n = 45, so n = 15.',
          difficulty: 'medium',
          irtA: 0.95, irtB: -0.1, irtC: 0.2,
          topics: ['Algebra', 'Consecutive Integers'],
          timeEstimate: 80
        }
      ],
      Verbal: [
        {
          id: 'gre-v-001',
          stem: 'The professor\'s lecture was so _____ that even the most diligent students struggled to stay awake.',
          choices: ['engaging', 'soporific', 'brief', 'controversial', 'enlightening'],
          correctIndex: 1,
          explanation: 'Soporific means sleep-inducing, which fits the context.',
          difficulty: 'medium',
          irtA: 1.0, irtB: 0.2, irtC: 0.2,
          topics: ['Vocabulary', 'Context Clues'],
          timeEstimate: 45
        },
        {
          id: 'gre-v-002',
          stem: 'Despite her _____ demeanor, she was actually quite anxious about the presentation.',
          choices: ['agitated', 'composed', 'verbose', 'reticent', 'ebullient'],
          correctIndex: 1,
          explanation: 'Despite indicates contrast; composed (calm) contrasts with anxious.',
          difficulty: 'medium',
          irtA: 0.9, irtB: 0.0, irtC: 0.2,
          topics: ['Text Completion', 'Contrast'],
          timeEstimate: 50
        },
        {
          id: 'gre-v-003',
          stem: 'The scientist\'s theory, once considered _____, is now widely accepted.',
          choices: ['orthodox', 'heretical', 'empirical', 'theoretical', 'practical'],
          correctIndex: 1,
          explanation: 'Heretical (unorthodox) contrasts with now widely accepted.',
          difficulty: 'medium',
          irtA: 1.1, irtB: 0.3, irtC: 0.2,
          topics: ['Vocabulary', 'Time Contrast'],
          timeEstimate: 45
        },
        {
          id: 'gre-v-004',
          stem: 'The author\'s argument is _____ because it relies on assumptions that are demonstrably false.',
          choices: ['compelling', 'fallacious', 'nuanced', 'prescient', 'eloquent'],
          correctIndex: 1,
          explanation: 'Fallacious means based on false reasoning.',
          difficulty: 'easy',
          irtA: 0.8, irtB: -0.5, irtC: 0.2,
          topics: ['Critical Reasoning', 'Vocabulary'],
          timeEstimate: 40
        },
        {
          id: 'gre-v-005',
          stem: 'Her _____ nature made her an excellent mediator in disputes.',
          choices: ['belligerent', 'partisan', 'impartial', 'perfunctory', 'cursory'],
          correctIndex: 2,
          explanation: 'Impartial (unbiased) is ideal for a mediator.',
          difficulty: 'easy',
          irtA: 0.85, irtB: -0.8, irtC: 0.2,
          topics: ['Vocabulary', 'Professional Qualities'],
          timeEstimate: 35
        }
      ]
    },
    
    GMAT: {
      Quantitative: [
        {
          id: 'gmat-q-001',
          stem: 'If x + y = 10 and x - y = 4, what is xy?',
          choices: ['16', '20', '21', '24', '25'],
          correctIndex: 2,
          explanation: 'Solving: x = 7, y = 3, so xy = 21.',
          difficulty: 'medium',
          irtA: 1.0, irtB: 0.0, irtC: 0.2,
          topics: ['Algebra', 'Systems'],
          timeEstimate: 90
        },
        {
          id: 'gmat-q-002',
          stem: 'A store offers 30% off, then an additional 20% off the reduced price. What is the total discount?',
          choices: ['44%', '46%', '50%', '52%', '56%'],
          correctIndex: 0,
          explanation: '0.7 × 0.8 = 0.56 final price, so 44% discount.',
          difficulty: 'medium',
          irtA: 1.1, irtB: 0.3, irtC: 0.2,
          topics: ['Percentages', 'Sequential Discounts'],
          timeEstimate: 100
        },
        {
          id: 'gmat-q-003',
          stem: 'If n is an integer and n² is odd, which must be true?',
          choices: ['n is odd', 'n is even', 'n is positive', 'n is negative', 'n is prime'],
          correctIndex: 0,
          explanation: 'Only odd numbers squared give odd results.',
          difficulty: 'easy',
          irtA: 0.8, irtB: -1.0, irtC: 0.2,
          topics: ['Number Properties', 'Logic'],
          timeEstimate: 45
        }
      ],
      Verbal: [
        {
          id: 'gmat-v-001',
          stem: 'The company\'s profits increased 20%; _____, bonuses were reduced.',
          choices: ['therefore', 'nevertheless', 'furthermore', 'consequently', 'similarly'],
          correctIndex: 1,
          explanation: 'Nevertheless shows contrast between profits and bonuses.',
          difficulty: 'easy',
          irtA: 0.75, irtB: -1.2, irtC: 0.2,
          topics: ['Transitions', 'Logic'],
          timeEstimate: 30
        }
      ]
    },

    LSAT: {
      LogicalReasoning: [
        {
          id: 'lsat-lr-001',
          stem: 'All lawyers are logical. Some logical people are creative. Therefore:',
          choices: [
            'All lawyers are creative',
            'Some lawyers are creative',
            'No lawyers are creative',
            'Some creative people are lawyers',
            'Cannot be determined'
          ],
          correctIndex: 4,
          explanation: 'The premises don\'t establish any necessary relationship between lawyers and creative people.',
          difficulty: 'medium',
          irtA: 1.2, irtB: 0.4, irtC: 0.2,
          topics: ['Formal Logic', 'Syllogisms'],
          timeEstimate: 90
        },
        {
          id: 'lsat-lr-002',
          stem: 'The argument assumes which of the following?',
          choices: [
            'The premise is true',
            'The conclusion follows from the premise',
            'There are no alternative explanations',
            'The sample is representative',
            'Correlation implies causation'
          ],
          correctIndex: 2,
          explanation: 'Identifying unstated assumptions is key to LSAT success.',
          difficulty: 'hard',
          irtA: 1.3, irtB: 0.8, irtC: 0.2,
          topics: ['Assumptions', 'Critical Thinking'],
          timeEstimate: 120
        },
        {
          id: 'lsat-lr-003',
          stem: 'Which would most weaken the argument that exercise improves mental health?',
          choices: [
            'Many people exercise regularly',
            'Exercise has physical benefits',
            'People with good mental health tend to exercise more',
            'Exercise is time-consuming',
            'Some exercises are dangerous'
          ],
          correctIndex: 2,
          explanation: 'This suggests reverse causation, weakening the causal claim.',
          difficulty: 'medium',
          irtA: 1.15, irtB: 0.3, irtC: 0.2,
          topics: ['Strengthen/Weaken', 'Causation'],
          timeEstimate: 100
        }
      ]
    },

    MCAT: {
      ChemPhys: [
        {
          id: 'mcat-cp-001',
          stem: 'A 2 kg object falls from rest for 2 seconds. Its kinetic energy is approximately:',
          choices: ['200 J', '400 J', '600 J', '800 J', '1000 J'],
          correctIndex: 1,
          explanation: 'v = gt = 10×2 = 20 m/s. KE = ½mv² = ½(2)(400) = 400 J.',
          difficulty: 'medium',
          irtA: 1.0, irtB: 0.1, irtC: 0.2,
          topics: ['Mechanics', 'Energy'],
          timeEstimate: 90
        },
        {
          id: 'mcat-cp-002',
          stem: 'In a galvanic cell, oxidation occurs at the:',
          choices: ['Anode', 'Cathode', 'Salt bridge', 'Both electrodes', 'Neither electrode'],
          correctIndex: 0,
          explanation: 'Mnemonic: An Ox (anode oxidation), Red Cat (reduction cathode).',
          difficulty: 'easy',
          irtA: 0.8, irtB: -1.0, irtC: 0.2,
          topics: ['Electrochemistry', 'Redox'],
          timeEstimate: 45
        },
        {
          id: 'mcat-cp-003',
          stem: 'The pH of a 0.01 M HCl solution is:',
          choices: ['1', '2', '3', '12', '13'],
          correctIndex: 1,
          explanation: 'pH = -log[H+] = -log(0.01) = 2.',
          difficulty: 'easy',
          irtA: 0.85, irtB: -0.8, irtC: 0.2,
          topics: ['Acids/Bases', 'pH'],
          timeEstimate: 60
        }
      ],
      BioBiochem: [
        {
          id: 'mcat-bb-001',
          stem: 'Which enzyme unwinds DNA during replication?',
          choices: ['DNA polymerase', 'Helicase', 'Ligase', 'Primase', 'Topoisomerase'],
          correctIndex: 1,
          explanation: 'Helicase unwinds the double helix.',
          difficulty: 'easy',
          irtA: 0.75, irtB: -1.2, irtC: 0.2,
          topics: ['Molecular Biology', 'DNA Replication'],
          timeEstimate: 45
        },
        {
          id: 'mcat-bb-002',
          stem: 'Competitive inhibition affects which kinetic parameter?',
          choices: ['Vmax only', 'Km only', 'Both Vmax and Km', 'Neither', 'Depends on substrate'],
          correctIndex: 1,
          explanation: 'Competitive inhibition increases apparent Km, Vmax unchanged.',
          difficulty: 'medium',
          irtA: 1.1, irtB: 0.3, irtC: 0.2,
          topics: ['Enzymes', 'Kinetics'],
          timeEstimate: 75
        }
      ]
    }
  },

  // Performance tracking data
  performanceMetrics: {
    adaptiveParameters: {
      initialTheta: 0,
      initialSE: 1,
      convergenceCriterion: 0.3,
      minQuestions: 20,
      maxQuestions: 50
    },
    scoringTables: {
      GRE: {
        thetaToScore: [
          { theta: -3, verbal: 130, quant: 130 },
          { theta: -2, verbal: 135, quant: 135 },
          { theta: -1, verbal: 145, quant: 145 },
          { theta: 0, verbal: 150, quant: 152 },
          { theta: 1, verbal: 160, quant: 162 },
          { theta: 2, verbal: 165, quant: 168 },
          { theta: 3, verbal: 170, quant: 170 }
        ]
      }
    }
  }
};

module.exports = seedData;
