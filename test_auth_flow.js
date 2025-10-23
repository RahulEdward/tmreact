// Test complete authentication flow
const baseUrl = "http://localhost:5000";

async function testAuthFlow() {
    try {
        console.log("Testing complete authentication flow...");
        
        // Test 1: Register a new user
        console.log("\n1. Testing Registration...");
        const registerResponse = await fetch(`${baseUrl}/auth/new/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "testuser123",
                email: "testuser123@example.com",
                password: "TestPass123!"
            }),
        });
        
        const registerData = await registerResponse.json();
        console.log("Registration status:", registerResponse.status);
        console.log("Registration response:", registerData);
        
        // Test 2: Try to login with the registered user
        console.log("\n2. Testing Login...");
        const loginResponse = await fetch(`${baseUrl}/auth/new/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important for session cookies
            body: JSON.stringify({
                email: "testuser123@example.com",
                password: "TestPass123!"
            }),
        });
        
        const loginData = await loginResponse.json();
        console.log("Login status:", loginResponse.status);
        console.log("Login response:", loginData);
        
        // Test 3: Check session after login
        console.log("\n3. Testing Session Check...");
        const sessionResponse = await fetch(`${baseUrl}/auth/new/session`, {
            method: "GET",
            credentials: "include", // Include cookies
        });
        
        const sessionData = await sessionResponse.json();
        console.log("Session status:", sessionResponse.status);
        console.log("Session response:", sessionData);
        
        // Test 4: Test logout
        console.log("\n4. Testing Logout...");
        const logoutResponse = await fetch(`${baseUrl}/auth/new/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                logout_all: false
            }),
        });
        
        const logoutData = await logoutResponse.json();
        console.log("Logout status:", logoutResponse.status);
        console.log("Logout response:", logoutData);
        
        console.log("\n✅ Authentication flow test completed!");
        
    } catch (error) {
        console.error("❌ Authentication test failed:", error);
    }
}

testAuthFlow();
