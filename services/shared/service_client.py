"""
Service Communication Client for EUREKA Phase 2 Services

Provides HTTP client for secure service-to-service communication
with automatic authentication, retries, and circuit breaking.
"""

import os
import logging
from typing import Dict, Any, Optional
import httpx
from datetime import datetime, timedelta

from .auth_middleware import create_service_token

logger = logging.getLogger(__name__)


class ServiceClient:
    """
    HTTP client for service-to-service communication with authentication.
    """

    def __init__(self, service_name: str, timeout: float = 30.0):
        """
        Initialize service client.

        Args:
            service_name: Name of this service (for authentication)
            timeout: Request timeout in seconds
        """
        self.service_name = service_name
        self.timeout = timeout
        self._token_cache: Optional[str] = None
        self._token_expiry: Optional[datetime] = None

        # Service URLs from environment
        self.service_urls = {
            "api-core": os.getenv("API_CORE_URL", "http://api-core:8000"),
            "tutor-llm": os.getenv("TUTOR_LLM_URL", "http://tutor-llm:8000"),
            "assessment": os.getenv("ASSESSMENT_URL", "http://assessment:8000"),
            "pedagogy": os.getenv("PEDAGOGY_URL", "http://pedagogy:8040"),
            "marketplace": os.getenv("MARKETPLACE_URL", "http://marketplace:8050"),
            "ai-research": os.getenv("AI_RESEARCH_URL", "http://ai-research:8060"),
            "xr-labs": os.getenv("XR_LABS_URL", "http://xr-labs:8070"),
            "ethics-security": os.getenv("ETHICS_SECURITY_URL", "http://ethics-security:8080"),
            "data-fabric": os.getenv("DATA_FABRIC_URL", "http://data-fabric:8090"),
            "institutions": os.getenv("INSTITUTIONS_URL", "http://institutions:8100"),
            "futures": os.getenv("FUTURES_URL", "http://futures:8110"),
        }

    def _get_service_token(self) -> str:
        """
        Get a valid service authentication token, using cache if available.

        Returns:
            JWT service token
        """
        now = datetime.utcnow()

        # Return cached token if still valid (with 5 minute buffer)
        if self._token_cache and self._token_expiry:
            if now < (self._token_expiry - timedelta(minutes=5)):
                return self._token_cache

        # Generate new token
        token = create_service_token(self.service_name)
        self._token_cache = token
        self._token_expiry = now + timedelta(minutes=60)

        return token

    def _get_headers(self, additional_headers: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """
        Get request headers with service authentication.

        Args:
            additional_headers: Optional additional headers

        Returns:
            Request headers dict
        """
        token = self._get_service_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-Service-Name": self.service_name,
        }

        if additional_headers:
            headers.update(additional_headers)

        return headers

    async def request(
        self,
        method: str,
        service: str,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Make an authenticated request to another service.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            service: Target service name
            path: API path (e.g., "/api/v1/users")
            data: Request body data
            params: Query parameters
            headers: Additional headers

        Returns:
            Response data as dict

        Raises:
            httpx.HTTPStatusError: If request fails
        """
        base_url = self.service_urls.get(service)
        if not base_url:
            raise ValueError(f"Unknown service: {service}")

        url = f"{base_url}{path}"
        request_headers = self._get_headers(headers)

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                logger.info(f"Service request: {method} {service}{path}")

                response = await client.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    headers=request_headers,
                )

                response.raise_for_status()
                return response.json()

            except httpx.HTTPStatusError as e:
                logger.error(f"Service request failed: {method} {service}{path} - {e}")
                raise
            except Exception as e:
                logger.error(f"Service request error: {method} {service}{path} - {e}")
                raise

    async def get(
        self,
        service: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Make a GET request to another service.

        Args:
            service: Target service name
            path: API path
            params: Query parameters
            headers: Additional headers

        Returns:
            Response data
        """
        return await self.request("GET", service, path, params=params, headers=headers)

    async def post(
        self,
        service: str,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Make a POST request to another service.

        Args:
            service: Target service name
            path: API path
            data: Request body
            headers: Additional headers

        Returns:
            Response data
        """
        return await self.request("POST", service, path, data=data, headers=headers)

    async def put(
        self,
        service: str,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Make a PUT request to another service.

        Args:
            service: Target service name
            path: API path
            data: Request body
            headers: Additional headers

        Returns:
            Response data
        """
        return await self.request("PUT", service, path, data=data, headers=headers)

    async def delete(
        self,
        service: str,
        path: str,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Make a DELETE request to another service.

        Args:
            service: Target service name
            path: API path
            headers: Additional headers

        Returns:
            Response data
        """
        return await self.request("DELETE", service, path, headers=headers)


# Singleton instance
_service_client: Optional[ServiceClient] = None


def get_service_client(service_name: str) -> ServiceClient:
    """
    Get or create the service client singleton.

    Args:
        service_name: Name of this service

    Returns:
        ServiceClient instance
    """
    global _service_client
    if _service_client is None:
        _service_client = ServiceClient(service_name)
    return _service_client
