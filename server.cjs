const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5060;

app.use(cors());
app.use(express.json());

// Simple health endpoint
app.get("/health", (req, res) => res.json({ ok: true }));

// Smart mock streaming endpoint - real jaisa feel
app.post("/api/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { prompt = "", businessName = "", shortDescription = "", targetMarket = "" } = req.body || {};
    
    if (!prompt.trim()) {
      res.write(`data: ${JSON.stringify({ section: "ERROR", type: "error", content: "Please provide a business idea", done: true })}\n\n`);
      res.end();
      return;
    }

    console.log("🚀 Generating pitch for:", prompt);

    // Send initial processing message
    res.write(`data: ${JSON.stringify({ section: "A", type: "meta", content: "🤖 AI is analyzing your business idea...", done: false })}\n\n`);

    // Generate all three sections with smart mock data
    await generateSmartPitchSection("A", "pitch_summary", prompt, businessName, res);
    await generateSmartPitchSection("B", "audience_marketing", prompt, targetMarket, res);
    await generateSmartPitchSection("C", "landing_page", prompt, businessName, res);

    // Send completion signal
    res.write(`data: ${JSON.stringify({ section: "DONE", type: "meta", content: "", done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error("❌ Stream Error:", error);
    res.write(`data: ${JSON.stringify({ section: "ERROR", type: "error", content: "Service temporarily unavailable", done: true })}\n\n`);
    res.end();
  }
});

// Smart mock data generation
async function generateSmartPitchSection(sectionId, sectionType, prompt, context, res) {
  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const content = generateSmartContent(sectionType, prompt, context);
  await streamText(sectionId, content, res);
}

function generateSmartContent(sectionType, prompt, context) {
  const businessIdea = prompt.toLowerCase();
  const name = context || generateBusinessName(prompt);
  
  const templates = {
    pitch_summary: `🚀 **Pitch Summary: ${name}**

Based on your idea: "${prompt}"

✨ **Tagline:** "Revolutionizing ${businessIdea} with innovative technology"

💼 **Problem Identified:** 
Current solutions for ${businessIdea} are outdated, inefficient, and lack modern features that today's users expect.

💡 **Our Solution:**
${name} provides a comprehensive platform that addresses these challenges through:
• AI-powered automation
• User-friendly interface
• Real-time analytics
• Scalable infrastructure

🎯 **Unique Value Proposition:**
We combine cutting-edge technology with practical business solutions to deliver 10x better performance than existing alternatives.

💰 **Business Model:**
• Freemium model for user acquisition
• Premium subscriptions for advanced features
• Enterprise solutions for large organizations
• Partnership programs for ecosystem growth

⭐ **Key Features:**
• Intelligent automation
• Cross-platform compatibility
• Advanced security measures
• 24/7 customer support
• Regular feature updates

📞 **Call to Action:**
Join thousands of satisfied users who have transformed their ${businessIdea} experience with ${name}. Start your journey today!`,

    audience_marketing: `🎯 **Target Audience & Marketing Strategy**

For: "${prompt}"

👥 **Primary Target Personas:**

1. **Tech-Savvy Professionals** (Age: 25-40)
   • Urban professionals seeking efficiency
   • Pain Points: Time constraints, complex workflows
   • Needs: Automation, mobile access, integration
   • Marketing: LinkedIn, tech blogs, productivity apps

2. **Small Business Owners** (Age: 35-55)  
   • Looking to scale operations efficiently
   • Pain Points: Limited resources, manual processes
   • Needs: Cost-effective solutions, easy implementation
   • Marketing: Facebook groups, local business networks

3. **Enterprise Decision Makers** (Age: 40-60)
   • Focused on ROI and security
   • Pain Points: Legacy systems, compliance issues
   • Needs: Enterprise-grade security, customization
   • Marketing: Direct sales, industry conferences

📈 **Marketing Channels Strategy:**

**Digital Marketing (60% Budget):**
• SEO & Content Marketing: Blog posts, case studies
• Social Media: LinkedIn, Twitter, Instagram
• Email Campaigns: Drip sequences, newsletters
• PPC Advertising: Google Ads, social media ads

**Partnerships (20% Budget):**
• Industry influencers and thought leaders
• Technology integration partners
• Affiliate marketing programs

**Traditional Marketing (20% Budget):**
• Industry event sponsorships
• Local business networking
• Print media in relevant publications

💰 **Budget Allocation:**
• Customer Acquisition: 40%
• Content Creation: 25%
• Technology & Tools: 20%
• Analytics & Testing: 15%

📊 **Key Performance Indicators:**
• Customer Acquisition Cost (CAC) < $50
• Conversion Rate > 5%
• Customer Lifetime Value (LTV) > $500
• Monthly Recurring Revenue Growth: 20% MoM
• Customer Satisfaction Score > 4.5/5

🎯 **Success Metrics:**
• Reach 10,000 users in first 6 months
• Achieve 80% customer retention rate
• Generate $100K MRR within first year
• Maintain 4.8-star average rating`,

    landing_page: `💻 **Landing Page Strategy & Code**

**Hero Section Design:**
# ${name} - Transform Your ${prompt} Experience
*"The intelligent platform that makes ${businessIdea} simple, powerful, and accessible to everyone."*

**Key Value Proposition:**
• 🚀 **10x Faster** than traditional methods
• 💰 **Save 40%** on operational costs  
• 📱 **Works Everywhere** - desktop, mobile, tablet
• 🔒 **Bank-Level Security** for your data

**Complete HTML + Tailwind CSS Code:**

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ${prompt} Solution</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-blue-600">${name}</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#features" class="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                    <a href="#pricing" class="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
                    <a href="#testimonials" class="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
                </div>
                <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Get Started Free
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your <span class="text-blue-600">${prompt}</span> Experience
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                The intelligent platform that makes ${businessIdea} simple, powerful, and accessible to everyone. Join thousands of satisfied users today.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center gap-2">
                    Start Free Trial <i class="fas fa-arrow-right"></i>
                </button>
                <button class="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors bg-white">
                    Watch Demo <i class="fas fa-play-circle"></i>
                </button>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-bolt text-green-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Lightning Fast</h3>
                    <p class="text-gray-600">Process data 10x faster than traditional methods with our optimized algorithms.</p>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Enterprise Security</h3>
                    <p class="text-gray-600">Bank-level encryption and compliance with industry security standards.</p>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-headset text-purple-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">24/7 Support</h3>
                    <p class="text-gray-600">Dedicated customer success team available round the clock to help you succeed.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Trust Indicators -->
    <div class="bg-gray-50 py-8 border-t border-gray-200">
        <div class="max-w-4xl mx-auto px-4">
            <p class="text-center text-gray-500 text-sm mb-6">Trusted by innovative companies worldwide</p>
            <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div class="text-gray-400 font-bold text-lg">TechCorp</div>
                <div class="text-gray-400 font-bold text-lg">StartupHub</div>
                <div class="text-gray-400 font-bold text-lg">InnovateLabs</div>
                <div class="text-gray-400 font-bold text-lg">FutureTech</div>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\`

**🎨 Conversion Optimization Tips:**

1. **Above the Fold:**
   • Clear value proposition in headline
   • Strong primary CTA button
   • Supporting social proof

2. **Trust Elements:**
   • Customer logos and testimonials
   • Security badges and guarantees
   • Media mentions and awards

3. **UX Best Practices:**
   • Fast loading times (< 3 seconds)
   • Mobile-responsive design
   • Clear navigation and hierarchy
   • Accessibility compliance

4. **A/B Testing Ideas:**
   • Test different CTA button colors
   • Experiment with hero section layouts
   • Try various trust indicator placements
   • Test pricing table designs

**📊 Expected Results:**
• Conversion Rate: 5-8%
• Bounce Rate: < 35%
• Average Session Duration: 3+ minutes
• Mobile Conversion Rate: 4-6%`
  };

  return templates[sectionType] || "Content generation failed. Please try again.";
}

// Stream text word by word
function streamText(sectionId, text, res, delay = 20) {
  return new Promise((resolve) => {
    const words = text.split(/(\s+)/);
    let idx = 0;
    
    const interval = setInterval(() => {
      if (idx >= words.length) {
        clearInterval(interval);
        res.write(`data: ${JSON.stringify({ section: sectionId, type: "meta", content: "", done: true })}\n\n`);
        resolve();
        return;
      }
      
      const chunk = words[idx++];
      res.write(`data: ${JSON.stringify({ section: sectionId, type: "text", content: chunk, done: false })}\n\n`);
    }, delay);
  });
}

function generateBusinessName(idea) {
  const prefixes = ["Smart", "Quick", "Next", "Pro", "Alpha", "Nova", "Elite", "Prime"];
  const suffixes = ["Tech", "Solutions", "Labs", "Hub", "Works", "AI", "Systems", "Platform"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const cleanIdea = idea.split(' ')[0].replace(/[^a-zA-Z]/g, '');
  return `${prefix}${cleanIdea}${suffix}`;
}

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Smart Pitch Generator running at http://localhost:${port}`);
    console.log("✅ Using enhanced mock data with AI-like responses");
  });
}