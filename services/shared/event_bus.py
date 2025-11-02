"""
Kafka Event Bus for EUREKA Phase 2 Services

Provides event publishing and consumption for asynchronous
service-to-service communication and event-driven architecture.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, Callable, List
from datetime import datetime
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from aiokafka.errors import KafkaError

logger = logging.getLogger(__name__)


class EventBus:
    """
    Kafka event bus for publishing and consuming events.
    """

    def __init__(self, service_name: str):
        """
        Initialize event bus.

        Args:
            service_name: Name of this service
        """
        self.service_name = service_name
        self.kafka_bootstrap_servers = os.getenv(
            "KAFKA_BOOTSTRAP_SERVERS",
            "kafka:9092"
        )

        self.producer: Optional[AIOKafkaProducer] = None
        self.consumers: Dict[str, AIOKafkaConsumer] = {}
        self.event_handlers: Dict[str, List[Callable]] = {}

    async def start(self):
        """Start the event bus producer."""
        try:
            self.producer = AIOKafkaProducer(
                bootstrap_servers=self.kafka_bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            )
            await self.producer.start()
            logger.info(f"Kafka producer started for {self.service_name}")
        except Exception as e:
            logger.error(f"Failed to start Kafka producer: {e}")
            raise

    async def stop(self):
        """Stop the event bus."""
        if self.producer:
            await self.producer.stop()
            logger.info("Kafka producer stopped")

        for consumer in self.consumers.values():
            await consumer.stop()
        logger.info("All Kafka consumers stopped")

    async def publish_event(
        self,
        topic: str,
        event_type: str,
        data: Dict[str, Any],
        user_id: Optional[str] = None,
    ) -> bool:
        """
        Publish an event to a Kafka topic.

        Args:
            topic: Kafka topic name
            event_type: Type of event (e.g., "user.created")
            data: Event payload data
            user_id: Optional user ID associated with event

        Returns:
            True if published successfully, False otherwise
        """
        if not self.producer:
            logger.error("Kafka producer not started")
            return False

        event = {
            "event_id": f"{self.service_name}_{datetime.utcnow().timestamp()}",
            "event_type": event_type,
            "service": self.service_name,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "data": data,
        }

        try:
            await self.producer.send_and_wait(topic, event)
            logger.info(f"Published event {event_type} to topic {topic}")
            return True
        except KafkaError as e:
            logger.error(f"Failed to publish event {event_type}: {e}")
            return False

    async def subscribe(
        self,
        topic: str,
        handler: Callable[[Dict[str, Any]], None],
        group_id: Optional[str] = None,
    ):
        """
        Subscribe to a Kafka topic and register event handler.

        Args:
            topic: Kafka topic to subscribe to
            handler: Async function to handle events
            group_id: Consumer group ID (defaults to service name)
        """
        if topic not in self.event_handlers:
            self.event_handlers[topic] = []

        self.event_handlers[topic].append(handler)

        # Create consumer if not exists for this topic
        if topic not in self.consumers:
            group = group_id or f"{self.service_name}_group"

            consumer = AIOKafkaConsumer(
                topic,
                bootstrap_servers=self.kafka_bootstrap_servers,
                group_id=group,
                value_deserializer=lambda v: json.loads(v.decode('utf-8')),
            )

            await consumer.start()
            self.consumers[topic] = consumer
            logger.info(f"Subscribed to topic {topic} with group {group}")

    async def consume_events(self, topic: str):
        """
        Start consuming events from a topic.

        Args:
            topic: Kafka topic to consume from
        """
        if topic not in self.consumers:
            logger.error(f"No consumer for topic {topic}")
            return

        consumer = self.consumers[topic]
        handlers = self.event_handlers.get(topic, [])

        try:
            async for message in consumer:
                event = message.value
                logger.info(f"Received event {event.get('event_type')} from topic {topic}")

                # Call all registered handlers for this topic
                for handler in handlers:
                    try:
                        await handler(event)
                    except Exception as e:
                        logger.error(f"Event handler error: {e}")

        except Exception as e:
            logger.error(f"Error consuming events from {topic}: {e}")


# Event Topics
class Topics:
    """Standard Kafka topics for EUREKA platform."""

    # User events
    USER_CREATED = "eureka.user.created"
    USER_UPDATED = "eureka.user.updated"
    USER_DELETED = "eureka.user.deleted"

    # Course events
    COURSE_CREATED = "eureka.course.created"
    COURSE_UPDATED = "eureka.course.updated"
    COURSE_ENROLLED = "eureka.course.enrolled"
    COURSE_COMPLETED = "eureka.course.completed"

    # Assessment events
    ASSESSMENT_STARTED = "eureka.assessment.started"
    ASSESSMENT_COMPLETED = "eureka.assessment.completed"
    ASSESSMENT_GRADED = "eureka.assessment.graded"

    # Learning events
    LESSON_VIEWED = "eureka.lesson.viewed"
    LESSON_COMPLETED = "eureka.lesson.completed"
    QUESTION_ANSWERED = "eureka.question.answered"

    # Tutor events
    TUTOR_SESSION_STARTED = "eureka.tutor.session.started"
    TUTOR_SESSION_ENDED = "eureka.tutor.session.ended"
    TUTOR_MESSAGE_SENT = "eureka.tutor.message.sent"

    # Pedagogy events
    KNOWLEDGE_STATE_UPDATED = "eureka.pedagogy.knowledge.updated"
    LEARNING_PATH_GENERATED = "eureka.pedagogy.path.generated"
    ADAPTATION_TRIGGERED = "eureka.pedagogy.adaptation.triggered"

    # Marketplace events
    CONTENT_PUBLISHED = "eureka.marketplace.content.published"
    CONTENT_PURCHASED = "eureka.marketplace.content.purchased"
    CONTENT_REVIEWED = "eureka.marketplace.content.reviewed"

    # XR events
    XR_SESSION_STARTED = "eureka.xr.session.started"
    XR_SESSION_ENDED = "eureka.xr.session.ended"
    XR_ACHIEVEMENT_UNLOCKED = "eureka.xr.achievement.unlocked"

    # Research events
    RESEARCH_QUERY = "eureka.research.query"
    RESEARCH_PAPER_ANALYZED = "eureka.research.paper.analyzed"
    RESEARCH_INSIGHT_GENERATED = "eureka.research.insight.generated"

    # Ethics & Security events
    SECURITY_ALERT = "eureka.security.alert"
    PRIVACY_VIOLATION = "eureka.security.privacy.violation"
    COMPLIANCE_CHECK = "eureka.security.compliance.check"

    # Analytics events
    ANALYTICS_EVENT = "eureka.analytics.event"
    PERFORMANCE_METRIC = "eureka.analytics.performance"


# Singleton instance
_event_bus: Optional[EventBus] = None


def get_event_bus(service_name: str) -> EventBus:
    """
    Get or create the event bus singleton.

    Args:
        service_name: Name of this service

    Returns:
        EventBus instance
    """
    global _event_bus
    if _event_bus is None:
        _event_bus = EventBus(service_name)
    return _event_bus


# Example usage and integration patterns
"""
EXAMPLE 1: Publishing an event from a service

from shared.event_bus import get_event_bus, Topics

# In your service startup
event_bus = get_event_bus("pedagogy")
await event_bus.start()

# Publishing an event
await event_bus.publish_event(
    topic=Topics.KNOWLEDGE_STATE_UPDATED,
    event_type="knowledge.state.updated",
    data={
        "user_id": "user123",
        "concept_id": "calculus_derivatives",
        "mastery_level": 0.85,
        "confidence": 0.92
    },
    user_id="user123"
)


EXAMPLE 2: Subscribing to events

from shared.event_bus import get_event_bus, Topics

# Define event handler
async def handle_course_enrollment(event: dict):
    user_id = event["user_id"]
    course_id = event["data"]["course_id"]

    # Initialize knowledge state for new course
    await initialize_learner_model(user_id, course_id)

# Subscribe to topic
event_bus = get_event_bus("pedagogy")
await event_bus.start()
await event_bus.subscribe(
    topic=Topics.COURSE_ENROLLED,
    handler=handle_course_enrollment
)

# Start consuming (usually in background task)
asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED))


EXAMPLE 3: Service integration in FastAPI

from fastapi import FastAPI
from contextlib import asynccontextmanager
from shared.event_bus import get_event_bus, Topics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    event_bus = get_event_bus("pedagogy")
    await event_bus.start()

    # Register event handlers
    await event_bus.subscribe(Topics.COURSE_ENROLLED, handle_enrollment)
    await event_bus.subscribe(Topics.LESSON_COMPLETED, handle_lesson_completion)

    # Start background consumers
    app.state.event_tasks = [
        asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED)),
        asyncio.create_task(event_bus.consume_events(Topics.LESSON_COMPLETED)),
    ]

    yield

    # Shutdown
    for task in app.state.event_tasks:
        task.cancel()
    await event_bus.stop()

app = FastAPI(lifespan=lifespan)
"""
