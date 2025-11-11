import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Adaptive Learning',
      description: 'Questions adapt to your ability level in real-time using advanced IRT algorithms'
    },
    {
      icon: ChartBarIcon,
      title: 'Comprehensive Analytics',
      description: 'Track your progress with detailed performance metrics and insights'
    },
    {
      icon: AcademicCapIcon,
      title: 'Multiple Exam Types',
      description: 'Prepare for GRE, GMAT, SAT, MCAT, LSAT and more'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Learning',
      description: 'Join study groups and compete on leaderboards'
    },
    {
      icon: LightBulbIcon,
      title: 'Smart Explanations',
      description: 'Get detailed AI-generated explanations for every question'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Personalized Study Plans',
      description: 'Receive customized study schedules based on your goals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🚀</span>
            <span className="text-2xl font-bold text-indigo-600">EUREKA</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Master Any Exam with
            <span className="text-indigo-600"> AI-Powered</span> Learning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            EUREKA adapts to your learning style, identifies your weaknesses, and creates
            personalized study paths to help you achieve your target scores.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all"
            >
              View Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose EUREKA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-indigo-100">Practice Questions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-indigo-100">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-indigo-100">Active Learners</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-indigo-100">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Ace Your Exam?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful students who achieved their dream scores with EUREKA.
          </p>
          <Link
            to="/register"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all"
          >
            Get Started Now - It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">© 2024 EUREKA Test Prep. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
