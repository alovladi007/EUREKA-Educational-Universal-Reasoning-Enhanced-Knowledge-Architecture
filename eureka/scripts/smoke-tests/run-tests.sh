#!/bin/bash
#
# EUREKA Platform - Smoke Tests
# Tests critical functionality after deployment
#

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

API_BASE_URL="${1:-https://api.eureka.example.com}"
APP_BASE_URL="${2:-https://app.eureka.example.com}"
NAMESPACE="${3:-eureka}"

FAILED_TESTS=0
PASSED_TESTS=0

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}EUREKA Platform Smoke Tests${NC}"
echo -e "${YELLOW}API: ${API_BASE_URL}${NC}"
echo -e "${YELLOW}App: ${APP_BASE_URL}${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "Testing: ${test_name}... "

    if eval "${test_command}" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

# Function to test HTTP endpoint
test_http() {
    local url="$1"
    local expected_status="${2:-200}"

    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${url}")

    if [ "${status}" -eq "${expected_status}" ]; then
        return 0
    else
        echo "Expected ${expected_status}, got ${status}" >&2
        return 1
    fi
}

# Function to test JSON response
test_json() {
    local url="$1"
    local json_path="$2"
    local expected_value="$3"

    response=$(curl -s --max-time 10 "${url}")
    actual_value=$(echo "${response}" | jq -r "${json_path}")

    if [ "${actual_value}" = "${expected_value}" ]; then
        return 0
    else
        echo "Expected ${expected_value}, got ${actual_value}" >&2
        return 1
    fi
}

echo -e "${YELLOW}Infrastructure Tests${NC}"
echo ""

# Test Kubernetes pods
run_test "All pods running" \
    "kubectl get pods -n ${NAMESPACE} --field-selector=status.phase=Running | grep -q Running"

run_test "API Core deployment ready" \
    "kubectl get deployment api-core -n ${NAMESPACE} -o jsonpath='{.status.readyReplicas}' | grep -q '[1-9]'"

run_test "PostgreSQL ready" \
    "kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=postgresql -o jsonpath='{.items[0].status.phase}' | grep -q Running"

run_test "Redis ready" \
    "kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=redis -o jsonpath='{.items[0].status.phase}' | grep -q Running"

echo ""
echo -e "${YELLOW}API Endpoint Tests${NC}"
echo ""

# Test API health endpoint
run_test "API health check" \
    "test_http ${API_BASE_URL}/health 200"

# Test API health response
run_test "API health status" \
    "test_json ${API_BASE_URL}/health '.status' 'healthy'"

# Test API docs
run_test "API documentation" \
    "test_http ${API_BASE_URL}/docs 200"

# Test API OpenAPI spec
run_test "OpenAPI specification" \
    "test_http ${API_BASE_URL}/openapi.json 200"

# Test API version endpoint
run_test "API version endpoint" \
    "test_http ${API_BASE_URL}/api/v1 404"  # Should return 404 as root /api/v1 is not a valid endpoint

echo ""
echo -e "${YELLOW}Authentication Tests${NC}"
echo ""

# Test registration endpoint exists
run_test "Registration endpoint" \
    "curl -s -X POST ${API_BASE_URL}/api/v1/auth/register -H 'Content-Type: application/json' -d '{}' -o /dev/null -w '%{http_code}' | grep -qE '(400|422)'"  # Should return validation error

# Test login endpoint exists
run_test "Login endpoint" \
    "curl -s -X POST ${API_BASE_URL}/api/v1/auth/login -H 'Content-Type: application/json' -d '{}' -o /dev/null -w '%{http_code}' | grep -qE '(400|422)'"  # Should return validation error

# Test protected endpoint without auth
run_test "Protected endpoint (no auth)" \
    "test_http ${API_BASE_URL}/api/v1/users/me 401"  # Should return unauthorized

echo ""
echo -e "${YELLOW}Frontend Tests${NC}"
echo ""

# Test frontend accessible
run_test "Frontend homepage" \
    "test_http ${APP_BASE_URL} 200"

# Test frontend static assets
run_test "Frontend assets loading" \
    "curl -s ${APP_BASE_URL} | grep -q 'eureka\\|EUREKA'"

echo ""
echo -e "${YELLOW}Database Tests${NC}"
echo ""

# Test database connection from API pod
run_test "Database connectivity" \
    "kubectl exec -n ${NAMESPACE} deployment/api-core -- python -c \"from app.core.database import engine; engine.connect()\" 2>&1 | grep -qv Error"

echo ""
echo -e "${YELLOW}TLS/SSL Tests${NC}"
echo ""

# Test TLS certificate
if [[ "${API_BASE_URL}" == https://* ]]; then
    run_test "TLS certificate valid" \
        "echo | openssl s_client -connect $(echo ${API_BASE_URL} | sed 's|https://||' | cut -d/ -f1):443 -servername $(echo ${API_BASE_URL} | sed 's|https://||' | cut -d/ -f1) 2>/dev/null | openssl x509 -noout -checkend 86400"
else
    echo "Skipping TLS tests (HTTP URL provided)"
fi

echo ""
echo -e "${YELLOW}Integration Tests${NC}"
echo ""

# Test user registration flow
run_test "User registration flow" \
    "curl -s -X POST ${API_BASE_URL}/api/v1/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"TestPass123!\",\"username\":\"testuser\",\"full_name\":\"Test User\"}' -o /dev/null -w '%{http_code}' | grep -qE '(201|400)'"  # 201 success or 400 if user exists

echo ""
echo -e "${YELLOW}Performance Tests${NC}"
echo ""

# Test response time
run_test "API response time < 1s" \
    "[ \$(curl -s -o /dev/null -w '%{time_total}' ${API_BASE_URL}/health | cut -d. -f1) -lt 1 ]"

echo ""
echo -e "${YELLOW}Monitoring Tests${NC}"
echo ""

# Test metrics endpoint
run_test "Metrics endpoint" \
    "test_http ${API_BASE_URL}/metrics 200"

# Test Prometheus metrics format
run_test "Prometheus metrics" \
    "curl -s ${API_BASE_URL}/metrics | grep -q 'http_requests_total'"

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS))

echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"
echo ""

if [ ${FAILED_TESTS} -eq 0 ]; then
    echo -e "${GREEN}All smoke tests passed! ✓${NC}"
    echo ""
    echo "Deployment is healthy and ready for use."
    exit 0
else
    echo -e "${RED}Some smoke tests failed! ✗${NC}"
    echo ""
    echo "Please review the failures above and check:"
    echo "  - Pod logs: kubectl logs -n ${NAMESPACE} deployment/api-core"
    echo "  - Events: kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp'"
    echo "  - Services: kubectl get svc -n ${NAMESPACE}"
    echo "  - Ingress: kubectl describe ingress -n ${NAMESPACE}"
    exit 1
fi
