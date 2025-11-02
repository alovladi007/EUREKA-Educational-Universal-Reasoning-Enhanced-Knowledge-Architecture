"""
Multi-agent research crew using CrewAI
"""
from typing import List, Dict, Optional
import logging
from crewai import Agent, Task, Crew, Process

logger = logging.getLogger(__name__)


class ResearchCrew:
    """Orchestrate multi-agent research workflows"""

    def __init__(self, llm_model: str = "gpt-4-turbo-preview"):
        self.llm_model = llm_model
        self.agents = {}
        self.tasks = []

    def create_literature_reviewer(self) -> Agent:
        """Create literature review agent"""
        return Agent(
            role="Literature Reviewer",
            goal="Analyze academic papers and extract key insights",
            backstory="""You are an expert academic researcher skilled in
            reading scientific papers, identifying methodologies, and
            synthesizing findings across multiple studies.""",
            verbose=True,
            allow_delegation=True
        )

    def create_hypothesis_generator(self) -> Agent:
        """Create hypothesis generation agent"""
        return Agent(
            role="Hypothesis Generator",
            goal="Generate novel research hypotheses based on literature gaps",
            backstory="""You are a creative researcher who identifies gaps
            in existing literature and proposes innovative hypotheses to
            address them.""",
            verbose=True,
            allow_delegation=True
        )

    def create_experiment_designer(self) -> Agent:
        """Create experiment design agent"""
        return Agent(
            role="Experiment Designer",
            goal="Design rigorous experiments to test hypotheses",
            backstory="""You are a methodologist expert in experimental
            design, statistical power analysis, and research ethics.""",
            verbose=True,
            allow_delegation=False
        )

    def create_data_analyst(self) -> Agent:
        """Create data analysis agent"""
        return Agent(
            role="Data Analyst",
            goal="Analyze research data and interpret results",
            backstory="""You are a statistician and data scientist skilled
            in quantitative analysis, visualization, and causal inference.""",
            verbose=True,
            allow_delegation=False
        )

    def research_workflow(
        self,
        topic: str,
        keywords: List[str],
        num_papers: int = 10
    ) -> Dict:
        """
        Execute full research workflow

        Agents collaborate to:
        1. Review literature
        2. Generate hypotheses
        3. Design experiments
        4. Suggest analysis methods

        Returns:
            {
                'literature_review': str,
                'hypotheses': List[str],
                'experiment_design': Dict,
                'analysis_plan': str
            }
        """
        logger.info(f"Starting research workflow for topic: {topic}")

        # Create agents
        reviewer = self.create_literature_reviewer()
        hypothesis_gen = self.create_hypothesis_generator()
        designer = self.create_experiment_designer()
        analyst = self.create_data_analyst()

        # Define tasks
        review_task = Task(
            description=f"""Review the top {num_papers} papers on '{topic}'
            focusing on keywords: {', '.join(keywords)}.
            Summarize key findings, methodologies, and gaps.""",
            agent=reviewer
        )

        hypothesis_task = Task(
            description=f"""Based on the literature review, generate 3-5
            novel research hypotheses that address identified gaps in '{topic}'.""",
            agent=hypothesis_gen
        )

        design_task = Task(
            description="""Design a rigorous experiment to test the most
            promising hypothesis. Include sample size, measures, and controls.""",
            agent=designer
        )

        analysis_task = Task(
            description="""Propose an analysis plan including statistical
            tests, effect sizes, and visualization strategies.""",
            agent=analyst
        )

        # Create crew
        crew = Crew(
            agents=[reviewer, hypothesis_gen, designer, analyst],
            tasks=[review_task, hypothesis_task, design_task, analysis_task],
            process=Process.sequential,
            verbose=True
        )

        # Execute
        try:
            result = crew.kickoff()
            logger.info("Research workflow completed successfully")
            return {
                'status': 'success',
                'topic': topic,
                'result': result
            }
        except Exception as e:
            logger.error(f"Research workflow failed: {e}", exc_info=True)
            return {
                'status': 'error',
                'error': str(e)
            }

    def paper_analysis_workflow(self, arxiv_id: str) -> Dict:
        """
        Analyze a single paper in depth

        Agents extract:
        - Key contributions
        - Methodology
        - Results
        - Limitations
        - Future work suggestions
        """
        logger.info(f"Analyzing paper: {arxiv_id}")

        reviewer = self.create_literature_reviewer()

        task = Task(
            description=f"""Analyze arXiv paper {arxiv_id}. Extract:
            1. Main contributions and novelty
            2. Methodology and experimental design
            3. Key results and findings
            4. Limitations and threats to validity
            5. Suggestions for future work

            Provide a structured summary.""",
            agent=reviewer
        )

        crew = Crew(
            agents=[reviewer],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )

        try:
            result = crew.kickoff()
            return {
                'status': 'success',
                'arxiv_id': arxiv_id,
                'analysis': result
            }
        except Exception as e:
            logger.error(f"Paper analysis failed: {e}", exc_info=True)
            return {
                'status': 'error',
                'error': str(e)
            }
