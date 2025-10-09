// Mock implementation - replace with actual API calls
export const User = {
  async me() {
    // Mock implementation - replace with actual authentication check
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return null to simulate not logged in, or user object if logged in
    // return null
    
    return {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin"
    }
  }
}