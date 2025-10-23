// Test CORS with browser preview origin
const baseUrl = "http://localhost:5000";

async function testBrowserOrigin() {
    try {
        console.log("Testing CORS with browser preview origin...");
        
        // Simulate a request from browser preview origin
        const response = await fetch(`${baseUrl}/auth/new/session`, {
            method: 'GET',
            headers: {
                'Origin': 'http://127.0.0.1:59675'  // Simulate browser preview origin
            }
        });
        
        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);
        
        if (response.headers.get('access-control-allow-origin') === 'http://127.0.0.1:59675') {
            console.log("✅ CORS fix successful! Browser preview origin is allowed.");
        } else {
            console.log("❌ CORS issue still exists.");
        }
        
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testBrowserOrigin();
