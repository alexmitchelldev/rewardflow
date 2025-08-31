export interface EnvCheckResult {
  isConfigured: boolean;
  missingVars: string[];
  hasSupabase: boolean;
  hasDatabase: boolean;
  warnings: string[];
}

export function checkEnvironmentConfiguration(): EnvCheckResult {
  const requiredVars = ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_ANON_KEY"];

  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // No additional database connection needed - using Supabase client only

  const hasSupabase = !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  const hasDatabase = hasSupabase;

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    hasSupabase,
    hasDatabase,
    warnings,
  };
}

export function logEnvironmentStatus(): void {
  const result = checkEnvironmentConfiguration();

  console.log("🔧 Environment Configuration Check:");

  if (result.isConfigured) {
    console.log("✅ All required environment variables are set");
  } else {
    console.log("❌ Missing required environment variables:");
    result.missingVars.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
    console.log("\n❌ Application requires Supabase configuration to run");
    console.log("ℹ️  Please check SUPABASE_SETUP.md for setup instructions");
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    result.warnings.forEach((warning) => {
      console.log(`   - ${warning}`);
    });
  }

  console.log("\n📊 Configuration Status:");
  console.log(`   Supabase: ${result.hasSupabase ? "✅" : "❌"}`);
  console.log(`   Database: ${result.hasDatabase ? "✅" : "❌"}`);

  if (!result.isConfigured) {
    console.log("\n⚠️  Application will not function without proper Supabase configuration");
  }
}

export function getConfigurationInstructions(): string {
  const result = checkEnvironmentConfiguration();

  if (result.isConfigured) {
    return "Environment is properly configured!";
  }

  return `
To enable Supabase authentication and database operations:

1. Create a .env.local file in your project root
2. Add these variables:
   ${result.missingVars.map((varName) => `${varName}=your_${varName.toLowerCase().replace("expo_public_", "").replace(/_/g, "_")}_here`).join("\n   ")}

3. Get these values from your Supabase project dashboard
4. See SUPABASE_SETUP.md for detailed instructions

Current status: Configuration required
  `.trim();
}
