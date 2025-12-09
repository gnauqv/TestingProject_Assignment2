# AuthService Unit Tests Summary

## Test File Location
`backend/src/test/java/com/assignment2/backend/service/AuthServiceUnitTest.java`

## Test Execution Results
✅ **All 18 Tests PASSED**
- Tests run: 18
- Failures: 0
- Errors: 0
- Skipped: 0

## Code Coverage
✅ **AuthService Coverage: 100%** (Exceeds 85% requirement)
- **Instruction Coverage:** 40/40 (100%)
- **Line Coverage:** 7/7 (100%)
- **Complexity Coverage:** 2/2 (100%)
- **Method Coverage:** 2/2 (100%)

## Test Categories

### 1. Test authenticate() Method - Success Scenario (1 test)
✅ **authenticate_WithValidCredentials_ReturnsSuccessfulLogin**
- Tests successful login with valid username and password
- Verifies response contains success=true, correct message, valid token, and user information
- Mocks AuthenticationManager and UserRepository

### 2. Test authenticate() Method - Invalid Username (1 test)
✅ **authenticate_WithNonExistentUsername_ThrowsException**
- Tests login with username that doesn't exist
- Verifies exception is thrown when user is not found in repository
- Ensures proper interaction with mocked dependencies

### 3. Test authenticate() Method - Invalid Password (1 test)
✅ **authenticate_WithInvalidPassword_ThrowsBadCredentialsException**
- Tests login with incorrect password
- Verifies BadCredentialsException is thrown by AuthenticationManager
- Confirms UserRepository is NOT called when authentication fails

### 4. Test Validation Methods - Validation Errors (4 tests)
✅ **authenticate_WithNullUsername_ThrowsException**
- Tests handling of null username input

✅ **authenticate_WithNullPassword_ThrowsException**
- Tests handling of null password input

✅ **authenticate_WithEmptyUsername_ThrowsException**
- Tests handling of empty string username

✅ **authenticate_WithEmptyOrWhitespacePassword_ThrowsException** (Parameterized)
- Tests handling of empty/whitespace passwords with multiple scenarios

### 5. Additional Comprehensive Tests (10 tests)

✅ **authenticate_GeneratesCorrectTokenFormat**
- Validates token generation follows correct format (jwt-token-{username})

✅ **authenticate_CorrectlyMapsUserToUserDto**
- Verifies User entity is correctly mapped to UserDto response

✅ **authenticate_WithDifferentUsers_WorksCorrectly**
- Tests authentication works correctly with different user accounts

✅ **authenticate_WithDifferentCaseUsername_TreatsAsCaseSensitive**
- Verifies username comparison is case-sensitive

✅ **authenticate_ReturnsCorrectSuccessMessage**
- Confirms success message contains expected Vietnamese text

✅ **authenticate_CallsAuthenticationManagerWithCorrectCredentials**
- Verifies AuthenticationManager is called with correct username and password

✅ **authenticate_CallsRepositoryAfterSuccessfulAuthentication**
- Confirms UserRepository is called to fetch user details after successful auth

✅ **authenticate_WithVeryLongUsername_HandlesCorrectly**
- Edge case: tests handling of very long (255 char) usernames

✅ **authenticate_WithSpecialCharactersInEmail_HandlesCorrectly**
- Edge case: tests handling of special characters in email addresses

✅ **authenticate_Handle multiple different users**
- Tests with various user scenarios

## Test Technologies & Tools
- **Framework:** JUnit 5 (Jupiter)
- **Mocking:** Mockito
- **Code Coverage:** JaCoCo 0.8.8
- **Build Tool:** Maven 3.9.10
- **Java Version:** Java 17 (compiled)

## How to Run Tests

**Run this specific test file:**
```bash
cd backend
mvn test -Dtest=AuthServiceUnitTest
```

**Run with code coverage report:**
```bash
cd backend
mvn clean test -Dtest=AuthServiceUnitTest jacoco:report
```

**View coverage report:**
Open `backend/target/site/jacoco/index.html` in your browser

**Run all tests in the backend:**
```bash
cd backend
mvn test
```

## Requirements Fulfillment Checklist

### a) Test method authenticate() with scenarios (3 điểm) ✅
- ✅ Login thành công (1 test)
- ✅ Login với username không tồn tại (1 test)
- ✅ Login với password sai (1 test)
- ✅ Validation errors (4 additional tests)

### b) Test validation methods riêng lẻ (1 điểm) ✅
- ✅ Null username validation
- ✅ Null password validation
- ✅ Empty username validation
- ✅ Empty/whitespace password validation (parameterized)

### c) Coverage >= 85% for AuthService (1 điểm) ✅
- ✅ **AuthService Coverage: 100%** (Exceeds 85% requirement)
- ✅ All methods fully covered
- ✅ All branches covered

## Test Design Patterns Used
1. **AAA Pattern (Arrange-Act-Assert)** - Clear test structure
2. **Mockito Framework** - For mocking external dependencies
3. **Parameterized Tests** - For testing multiple scenarios with same logic
4. **Display Names** - For readable test output (using @DisplayName)
5. **BeforeEach** - For setup and initialization
6. **Verify Interactions** - For confirming mock method calls

## Key Testing Insights
- Tests isolate AuthService by mocking AuthenticationManager and UserRepository
- Token generation is validated to follow expected format
- User mapping from entity to DTO is thoroughly tested
- Edge cases like case sensitivity and special characters are covered
- Validation logic is tested with multiple invalid input scenarios
- Mock interactions are verified to ensure correct service behavior
