// Authentication and authorization service
export class AuthService {
  static async authenticateUser(credentials) {
    // In a real app, this would make an API call to your backend
    const { email, password, role } = credentials
    
    // Mock authentication - replace with actual API call
    const mockUsers = [
      {
        id: "USER001",
        email: "user@cleanbage.com",
        password: "user123",
        name: "John Doe",
        role: "user",
        society: "Green Valley Society",
        coins: 250,
        rank: 15,
        isAuthorized: true
      },
      {
        id: "COLLECTOR001",
        email: "collector@cleanbage.com",
        password: "collector123",
        name: "Mike Wilson",
        role: "collector",
        society: "Green Valley Society",
        coins: 500,
        rank: 3,
        isAuthorized: true,
        collectorId: "COL001",
        authorizedBy: "Green Valley Admin",
        authorizedDate: "2024-01-01"
      },
      {
        id: "BOTH001",
        email: "both@cleanbage.com",
        password: "both123",
        name: "Sarah Johnson",
        role: "both", // Can be both user and collector
        society: "Green Valley Society",
        coins: 350,
        rank: 8,
        isAuthorized: true,
        collectorId: "COL002",
        authorizedBy: "Green Valley Admin",
        authorizedDate: "2024-01-01"
      },
      {
        id: "UNAUTHORIZED001",
        email: "unauthorized@cleanbage.com",
        password: "unauth123",
        name: "Unauthorized Person",
        role: "user", // Only has user role, not authorized as collector
        society: "Green Valley Society",
        coins: 0,
        rank: 999,
        isAuthorized: false // Not authorized as collector
      }
    ]
    
    // Find user by email and password
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error("Invalid email or password")
    }
    
    // Enhanced security: Check role authorization
    if (role === "collector") {
      if (!this.isAuthorizedCollector(user)) {
        throw new Error("Access denied: You are not authorized as a collector for this community. Please contact your community administrator.")
      }
    } else if (role === "user") {
      // Even regular users need to be verified community members
      if (!user.society) {
        throw new Error("Access denied: You must be a verified community member to access this application.")
      }
    }
    
    // Return user with selected role
    return {
      ...user,
      selectedRole: role,
      canSwitchRoles: user.role === "both"
    }
  }
  
  static async registerUser(userData) {
    // In a real app, this would make an API call to your backend
    const { email, password, name, society, phone, role } = userData
    
    // Check if email already exists
    const existingUser = await this.findUserByEmail(email)
    if (existingUser) {
      throw new Error("An account with this email already exists")
    }
    
    // Validate required fields
    if (!email || !password || !name || !society) {
      throw new Error("Please fill in all required fields")
    }
    
    // For collector registration, require additional verification
    if (role === "collector") {
      throw new Error("Collector registration requires community admin approval. Please contact your community administrator to become an authorized collector.")
    }
    
    // Create new user (only for regular users)
    const newUser = {
      id: `USER${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      name,
      role: "user", // New registrations are always regular users
      society,
      phone,
      coins: 0,
      rank: 999,
      isAuthorized: true, // Regular users are automatically authorized
      createdAt: new Date().toISOString()
    }
    
    // In a real app, save to database
    console.log("New user registered:", newUser)
    
    return {
      ...newUser,
      selectedRole: "user",
      canSwitchRoles: false
    }
  }
  
  static async findUserByEmail(email) {
    // Mock function to check if user exists
    const mockUsers = [
      "user@cleanbage.com",
      "collector@cleanbage.com", 
      "both@cleanbage.com",
      "unauthorized@cleanbage.com"
    ]
    
    return mockUsers.includes(email) ? { email } : null
  }
  
  static isAuthorizedCollector(user) {
    return user.isAuthorized && 
           (user.role === "collector" || user.role === "both") &&
           user.collectorId
  }
  
  static getAvailableRoles(user) {
    const roles = ["user"]
    
    if (this.isAuthorizedCollector(user)) {
      roles.push("collector")
    }
    
    return roles
  }
  
  static async verifyCollectorAuthorization(collectorId) {
    // In a real app, this would verify with community database
    const authorizedCollectors = [
      "COL001",
      "COL002",
      "COL003"
    ]
    
    return authorizedCollectors.includes(collectorId)
  }
  
  static validatePassword(password) {
    // Password validation rules
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }
    return true
  }
  
  static validateEmail(email) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address")
    }
    return true
  }
}
