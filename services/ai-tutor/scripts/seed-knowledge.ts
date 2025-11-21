/**
 * Knowledge Base Seeder
 * Populates the STEM knowledge base with comprehensive content
 */

import { Pool } from 'pg';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eureka',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// =====================================================
// MATHEMATICS KNOWLEDGE
// =====================================================

const mathematicsKnowledge = [
  {
    subject_domain: 'mathematics',
    topic: 'Algebra',
    subtopic: 'Linear Equations',
    difficulty_level: 'high_school',
    title: 'Solving Linear Equations',
    content: 'Linear equations are equations where the highest power of the variable is 1. To solve: 1) Isolate the variable term, 2) Divide or multiply to get the variable alone. Example: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, divide by 2: x = 4.',
    content_type: 'concept',
    equations: ['ax + b = c', 'x = \\frac{c - b}{a}'],
    keywords: ['linear', 'equation', 'algebra', 'solving', 'variable'],
  },
  {
    subject_domain: 'mathematics',
    topic: 'Calculus',
    subtopic: 'Limits',
    difficulty_level: 'undergraduate',
    title: 'Definition of a Limit',
    content: 'A limit describes the value that a function approaches as the input approaches some value. Formally: lim(x→a) f(x) = L means that f(x) can be made arbitrarily close to L by making x sufficiently close to a.',
    content_type: 'theorem',
    equations: ['\\lim_{x \\to a} f(x) = L', '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'],
    keywords: ['limit', 'calculus', 'continuity', 'function'],
  },
  {
    subject_domain: 'mathematics',
    topic: 'Calculus',
    subtopic: 'Derivatives',
    difficulty_level: 'undergraduate',
    title: 'Chain Rule',
    content: 'The chain rule is used to differentiate composite functions. If y = f(g(x)), then dy/dx = f\'(g(x)) · g\'(x). This is fundamental for complex derivatives.',
    content_type: 'theorem',
    equations: ['\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)', '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}'],
    keywords: ['derivative', 'chain rule', 'composite function', 'calculus'],
  },
  {
    subject_domain: 'mathematics',
    topic: 'Linear Algebra',
    subtopic: 'Eigenvalues',
    difficulty_level: 'undergraduate',
    title: 'Eigenvalues and Eigenvectors',
    content: 'An eigenvector of a matrix A is a non-zero vector v such that Av = λv for some scalar λ (the eigenvalue). Eigenvalues are found by solving det(A - λI) = 0.',
    content_type: 'concept',
    equations: ['Av = \\lambda v', '\\det(A - \\lambda I) = 0'],
    keywords: ['eigenvalue', 'eigenvector', 'matrix', 'linear algebra'],
  },
  {
    subject_domain: 'mathematics',
    topic: 'Statistics',
    subtopic: 'Normal Distribution',
    difficulty_level: 'undergraduate',
    title: 'Normal Distribution',
    content: 'The normal distribution is a probability distribution that is symmetric about the mean, showing that data near the mean are more frequent than data far from the mean. It\'s characterized by mean μ and standard deviation σ.',
    content_type: 'concept',
    equations: ['f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}'],
    keywords: ['statistics', 'normal distribution', 'bell curve', 'probability'],
  },
];

// =====================================================
// PHYSICS KNOWLEDGE
// =====================================================

const physicsKnowledge = [
  {
    subject_domain: 'physics',
    topic: 'Mechanics',
    subtopic: 'Newton\'s Laws',
    difficulty_level: 'high_school',
    title: 'Newton\'s Second Law',
    content: 'Newton\'s second law states that the force acting on an object is equal to the mass of that object times its acceleration: F = ma. This is the foundation of classical mechanics.',
    content_type: 'theorem',
    equations: ['F = ma', 'a = \\frac{F}{m}'],
    keywords: ['force', 'mass', 'acceleration', 'newton', 'mechanics'],
  },
  {
    subject_domain: 'physics',
    topic: 'Electromagnetism',
    subtopic: 'Maxwell\'s Equations',
    difficulty_level: 'undergraduate',
    title: 'Gauss\'s Law',
    content: 'Gauss\'s law relates the electric flux through a closed surface to the enclosed electric charge. It\'s one of Maxwell\'s four fundamental equations.',
    content_type: 'theorem',
    equations: ['\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}'],
    keywords: ['gauss', 'electric field', 'flux', 'maxwell', 'electromagnetism'],
  },
  {
    subject_domain: 'physics',
    topic: 'Thermodynamics',
    subtopic: 'Laws of Thermodynamics',
    difficulty_level: 'undergraduate',
    title: 'Second Law of Thermodynamics',
    content: 'The second law states that entropy of an isolated system never decreases over time. Heat naturally flows from hot to cold bodies. This introduces the concept of irreversibility.',
    content_type: 'theorem',
    equations: ['\\Delta S \\geq 0', 'dS = \\frac{dQ}{T}'],
    keywords: ['thermodynamics', 'entropy', 'second law', 'heat'],
  },
  {
    subject_domain: 'physics',
    topic: 'Quantum Mechanics',
    subtopic: 'Wave Function',
    difficulty_level: 'graduate',
    title: 'Schrödinger Equation',
    content: 'The Schrödinger equation is the fundamental equation of quantum mechanics. It describes how the quantum state of a physical system changes with time.',
    content_type: 'theorem',
    equations: ['i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi'],
    keywords: ['quantum', 'schrodinger', 'wave function', 'quantum mechanics'],
  },
];

// =====================================================
// COMPUTER SCIENCE KNOWLEDGE
// =====================================================

const computerScienceKnowledge = [
  {
    subject_domain: 'computer_science',
    topic: 'Data Structures',
    subtopic: 'Binary Trees',
    difficulty_level: 'undergraduate',
    title: 'Binary Search Tree',
    content: 'A Binary Search Tree (BST) is a tree where each node has at most two children, and for each node: all values in left subtree < node value < all values in right subtree. Average time complexity for search, insert, delete: O(log n).',
    content_type: 'concept',
    code_examples: [
      {
        language: 'python',
        code: 'class TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef search(root, target):\n    if not root or root.val == target:\n        return root\n    if target < root.val:\n        return search(root.left, target)\n    return search(root.right, target)'
      }
    ],
    keywords: ['binary tree', 'BST', 'data structure', 'search'],
  },
  {
    subject_domain: 'computer_science',
    topic: 'Algorithms',
    subtopic: 'Dynamic Programming',
    difficulty_level: 'undergraduate',
    title: 'Fibonacci with Memoization',
    content: 'Dynamic programming optimizes recursive solutions by storing results of subproblems. Fibonacci is a classic example where memoization reduces time complexity from O(2^n) to O(n).',
    content_type: 'algorithm',
    code_examples: [
      {
        language: 'python',
        code: 'def fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 2:\n        return 1\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]'
      }
    ],
    keywords: ['dynamic programming', 'fibonacci', 'memoization', 'optimization'],
  },
  {
    subject_domain: 'computer_science',
    topic: 'Machine Learning',
    subtopic: 'Neural Networks',
    difficulty_level: 'graduate',
    title: 'Backpropagation Algorithm',
    content: 'Backpropagation is the algorithm used to train neural networks. It computes gradients of the loss function with respect to weights using the chain rule, allowing gradient descent optimization.',
    content_type: 'algorithm',
    equations: ['\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}'],
    keywords: ['neural network', 'backpropagation', 'gradient descent', 'deep learning'],
  },
];

// =====================================================
// CHEMISTRY KNOWLEDGE
// =====================================================

const chemistryKnowledge = [
  {
    subject_domain: 'chemistry',
    topic: 'General Chemistry',
    subtopic: 'Stoichiometry',
    difficulty_level: 'high_school',
    title: 'Mole Concept',
    content: 'The mole is a unit that represents 6.022 × 10^23 particles (Avogadro\'s number). It\'s used to convert between atoms/molecules and grams. Molar mass is the mass of one mole of a substance.',
    content_type: 'concept',
    equations: ['n = \\frac{m}{M}', 'N = n \\times N_A'],
    keywords: ['mole', 'avogadro', 'stoichiometry', 'molar mass'],
  },
  {
    subject_domain: 'chemistry',
    topic: 'Organic Chemistry',
    subtopic: 'Functional Groups',
    difficulty_level: 'undergraduate',
    title: 'Alcohol Functional Group',
    content: 'Alcohols are organic compounds containing a hydroxyl (-OH) group bonded to a carbon atom. They can be classified as primary, secondary, or tertiary based on the carbon bearing the -OH group.',
    content_type: 'concept',
    keywords: ['alcohol', 'hydroxyl', 'functional group', 'organic chemistry'],
  },
];

// =====================================================
// ENGINEERING KNOWLEDGE
// =====================================================

const engineeringKnowledge = [
  {
    subject_domain: 'mechanical_engineering',
    topic: 'Fluid Mechanics',
    subtopic: 'Bernoulli\'s Equation',
    difficulty_level: 'undergraduate',
    title: 'Bernoulli\'s Principle',
    content: 'Bernoulli\'s equation states that for an inviscid flow, an increase in velocity occurs simultaneously with a decrease in pressure or potential energy. It\'s fundamental in fluid dynamics.',
    content_type: 'theorem',
    equations: ['P + \\frac{1}{2}\\rho v^2 + \\rho gh = constant'],
    keywords: ['fluid mechanics', 'bernoulli', 'pressure', 'velocity'],
  },
  {
    subject_domain: 'electrical_engineering',
    topic: 'Circuit Analysis',
    subtopic: 'Kirchhoff\'s Laws',
    difficulty_level: 'undergraduate',
    title: 'Kirchhoff\'s Current Law (KCL)',
    content: 'KCL states that the sum of currents entering a node equals the sum of currents leaving the node. This is based on charge conservation. ∑I_in = ∑I_out',
    content_type: 'theorem',
    equations: ['\\sum I_{in} = \\sum I_{out}'],
    keywords: ['kirchhoff', 'current', 'circuit', 'electrical'],
  },
];

// =====================================================
// SEEDING FUNCTION
// =====================================================

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return [];
  }
}

async function seedKnowledge() {
  console.log('🌱 Starting knowledge base seeding...\n');

  const allKnowledge = [
    ...mathematicsKnowledge,
    ...physicsKnowledge,
    ...computerScienceKnowledge,
    ...chemistryKnowledge,
    ...engineeringKnowledge,
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const item of allKnowledge) {
    try {
      // Generate embedding
      const textToEmbed = `${item.title} ${item.content} ${item.keywords.join(' ')}`;
      console.log(`Generating embedding for: ${item.title}...`);

      const embedding = await generateEmbedding(textToEmbed);

      if (embedding.length === 0) {
        console.error(`❌ Failed to generate embedding for: ${item.title}`);
        errorCount++;
        continue;
      }

      // Insert into database
      await pool.query(
        `
        INSERT INTO stem_knowledge_base (
          subject_domain, topic, subtopic, difficulty_level,
          title, content, content_type,
          equations, formulas, code_examples,
          keywords, embedding, is_verified, quality_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT DO NOTHING
      `,
        [
          item.subject_domain,
          item.topic,
          item.subtopic || null,
          item.difficulty_level,
          item.title,
          item.content,
          item.content_type,
          item.equations || [],
          item.formulas ? JSON.stringify(item.formulas) : '[]',
          item.code_examples ? JSON.stringify(item.code_examples) : '[]',
          item.keywords,
          `[${embedding.join(',')}]`,
          true,
          0.95,
        ]
      );

      console.log(`✅ Added: ${item.title}`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error adding ${item.title}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  await pool.end();
}

// Run seeder
seedKnowledge()
  .then(() => {
    console.log('\n🎉 Knowledge base seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
