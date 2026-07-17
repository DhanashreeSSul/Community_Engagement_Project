require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas for seeding"))
    .catch((err) => { console.error("Connection Error:", err); process.exit(1); });

// Import Models
const User = require("./mongodb");
const Scheme = require("./models/Scheme");

const schemes = [
    {
        name: "Rural Infrastructure Development Fund (RIDF)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Finance rural infrastructure projects",
        features: "Credit for rural infrastructure like irrigation, roads, and warehousing.",
        eligibility: "State Governments, Local Bodies, Rural Development Organizations",
        link: "https://www.nabard.org/content.aspx?id=570"
    },
    {
        name: "NABARD Financial Services (NABFINS)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Provide financial services to rural areas",
        features: "Loans and financial support to rural businesses, farmers, and SHGs.",
        eligibility: "Farmers, SHGs, rural enterprises, microfinance institutions",
        link: "https://www.nabfins.org/"
    },
    {
        name: "Maharashtra Mukhyamantri Saur Krushi Pump Yojana",
        launchedBy: "Maharashtra Government",
        type: "State",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote solar-powered irrigation systems",
        features: "Subsidies for solar water pumps",
        eligibility: "Farmers with a functional water source for irrigation",
        link: "https://www.mahadiscom.in/solar/index.html"
    },
    {
        name: "Mahatma Jyotirao Phule Karj Mukti Yojana",
        launchedBy: "Maharashtra Government",
        type: "State",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Loan waiver for farmers",
        features: "Waives loans up to ₹2 lakhs",
        eligibility: "Small and marginal farmers with outstanding crop loans",
        link: "https://shetkari.mahaonline.gov.in/"
    },
    {
        name: "Telangana Rythu Bandhu",
        launchedBy: "Telangana Government",
        type: "State",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Direct investment support for farmers",
        features: "₹10,000 per acre per year",
        eligibility: "Farmers owning land in Telangana",
        link: "https://treasury.telangana.gov.in/"
    },
    {
        name: "Odisha KALIA Scheme",
        launchedBy: "Odisha Government",
        type: "State",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Financial support to small and marginal farmers",
        features: "₹10,000/year for input costs, livelihood support, and insurance",
        eligibility: "Small and marginal farmers, sharecroppers, and landless agricultural laborers",
        link: "https://kalia.odisha.gov.in/"
    },
    {
        name: "Madhya Pradesh Bhavantar Bhugtan Yojana",
        launchedBy: "Madhya Pradesh Government",
        type: "State",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Compensate farmers for price differences in crops",
        features: "Farmers receive payment for the gap between market price and MSP",
        eligibility: "Farmers cultivating crops specified under the scheme",
        link: "http://mpkrishi.mp.gov.in/"
    },
    {
        name: "National Livestock Mission (NLM)",
        launchedBy: "Ministry of Agriculture",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Support for animal husbandry and fisheries",
        features: "Financial assistance for livestock development",
        eligibility: "Farmers, livestock owners, and entrepreneurs in allied sectors",
        link: "https://dahd.nic.in/national-livestock-mission"
    },
    {
        name: "Agri-Clinics and Agri-Business Centres Scheme",
        launchedBy: "Ministry of Agriculture",
        type: "Central",
        residence: "Urban",
        occupation: "Entrepreneur",
        objective: "Encourage entrepreneurship in agriculture",
        features: "Training and loans to set up agri-business ventures",
        eligibility: "Graduates in agriculture and allied disciplines",
        link: "https://www.agriclinics.net/"
    },
    {
        name: "PM Atma Nirbhar Bharat Agriculture Infrastructure Fund",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Create agriculture infrastructure at the farm level",
        features: "Loans for building storage, processing units, and other facilities",
        eligibility: "Individuals, cooperatives, FPOs, and companies in the agriculture sector",
        link: "https://www.agriinfra.dac.gov.in/"
    },
    {
        name: "SHG-Bank Linkage Programme",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Link SHGs with banks for financial inclusion",
        features: "Provides credit to SHGs, improving access to loans for rural women and marginalized groups",
        eligibility: "Self-Help Groups (SHGs), rural women, and marginalized communities",
        link: "https://www.nabard.org/content.aspx?id=591"
    },
    {
        name: "Kisan Credit Card (KCC) Scheme",
        launchedBy: "NABARD & Banks",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Provide timely credit to farmers for agricultural needs",
        features: "Working capital loans at subsidized interest rates for farmers involved in farming and allied activities",
        eligibility: "Farmers engaged in farming and allied activities",
        link: "https://vikaspedia.in/agriculture/policies-and-schemes/kisan-credit-card-kcc"
    },
    {
        name: "Producer Organizations Development Fund (PODF)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote the formation of Farmer Producer Organizations (FPOs)",
        features: "Financial assistance for strengthening FPOs, making them more competitive and sustainable",
        eligibility: "Farmer Producer Organizations (FPOs) and cooperatives",
        link: "https://www.nabard.org/content.aspx?id=613"
    },
    {
        name: "Farm Sector Promotion Programs",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Enhance productivity and efficiency in agriculture",
        features: "Support for organic farming, farm mechanization, and value-added processing",
        eligibility: "Farmers, FPOs, cooperatives, and rural agricultural enterprises",
        link: "https://www.nabard.org/content.aspx?id=589"
    },
    {
        name: "Farm Mechanization Scheme",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote modern farm machinery to improve productivity",
        features: "Provides loans and subsidies for purchasing tractors, harvesters, and other farm equipment",
        eligibility: "Farmers, cooperatives, and farmer groups involved in mechanized farming",
        link: "https://agricoop.nic.in/en/Farm-mechanization"
    },
    {
        name: "Rural Credit Facility",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Provide rural development credit",
        features: "Loans for agricultural development, irrigation, land development, and rural infrastructure",
        eligibility: "Farmers, rural businesses, and rural development projects",
        link: "https://www.nabard.org/content.aspx?id=627"
    },
    {
        name: "NABARD Scheme for Microfinance",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Promote microfinance to improve financial access",
        features: "Financial support to Microfinance Institutions (MFIs) and SHGs for financing farmers and rural populations",
        eligibility: "Microfinance institutions, SHGs, and rural enterprises",
        link: "https://www.nabard.org/content.aspx?id=592"
    },
    {
        name: "Watershed Development Fund (WDF)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote sustainable land and water management practices",
        features: "Financial assistance for watershed development and water conservation projects",
        eligibility: "Watershed development projects, local bodies, NGOs, and rural communities",
        link: "https://www.nabard.org/content.aspx?id=611"
    },
    {
        name: "Rural Entrepreneurship Development Program (REDP)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Encourage rural entrepreneurship",
        features: "Training, financial assistance, and technical support for rural entrepreneurs",
        eligibility: "Rural entrepreneurs, micro and small businesses in rural areas",
        link: "https://www.nabard.org/content.aspx?id=603"
    },
    {
        name: "Export Finance",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Support agricultural exports",
        features: "Provides pre-shipment and post-shipment finance for agricultural exports",
        eligibility: "Agricultural exporters, FPOs, cooperatives engaged in export activities",
        link: "https://www.nabard.org/content.aspx?id=617"
    },
    {
        name: "Kisan Credit Card (KCC) Scheme for Fisheries",
        launchedBy: "NABARD & Banks",
        type: "Central",
        residence: "Rural",
        occupation: "Fisher",
        objective: "Provide credit facilities to fish farmers",
        features: "Special provisions for fish farmers under the KCC scheme",
        eligibility: "Fish farmers and aquaculture units",
        link: "https://dof.gov.in/fisheries-sector/kisan-credit-card-kcc"
    },
    {
        name: "Financial Inclusion Fund (FIF)",
        launchedBy: "NABARD",
        type: "Central",
        residence: "Rural",
        occupation: "Entrepreneur",
        objective: "Promote financial inclusion in rural areas",
        features: "Funds for institutions and initiatives aimed at expanding financial inclusion",
        eligibility: "Financial institutions, SHGs, and rural businesses",
        link: "https://www.nabard.org/content.aspx?id=593"
    },
    {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Provide financial support to farmers",
        features: "₹6,000/year paid in three installments",
        eligibility: "All small and marginal farmers owning up to 2 hectares of cultivable land",
        link: "https://pmkisan.gov.in/"
    },
    {
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Crop insurance to protect farmers from natural calamities",
        features: "Low premium rates, quick claim settlements",
        eligibility: "Farmers growing notified crops in notified areas",
        link: "https://pmfby.gov.in/"
    },
    {
        name: "Kisan Credit Card (KCC)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Provide credit facilities to farmers",
        features: "Loans for crops, animal husbandry, fisheries at low-interest rates",
        eligibility: "Farmers, dairy farmers, and fishers who meet lending institution criteria",
        link: "https://vikaspedia.in/agriculture/policies-and-schemes/kisan-credit-card-kcc"
    },
    {
        name: "PM Krishi Sinchayee Yojana (PMKSY)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Enhance irrigation coverage and water use efficiency",
        features: "Per-drop-more-crop, watershed development, and irrigation projects",
        eligibility: "All farmers, including groups or individual beneficiaries",
        link: "https://pmksy.gov.in/"
    },
    {
        name: "Soil Health Card Scheme",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote balanced use of fertilizers based on soil testing",
        features: "Farmers receive a card with soil quality reports and nutrient recommendations",
        eligibility: "All farmers across the country",
        link: "https://soilhealth.dac.gov.in/"
    },
    {
        name: "National Mission for Sustainable Agriculture (NMSA)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote sustainable agriculture through climate change adaptation",
        features: "Support for rainfed areas, soil health, water use efficiency, and organic farming",
        eligibility: "All farmers across India",
        link: "https://nmsa.dac.gov.in/"
    },
    {
        name: "Paramparagat Krishi Vikas Yojana (PKVY)",
        launchedBy: "Government of India",
        type: "Central",
        residence: "Rural",
        occupation: "Farmer",
        objective: "Promote organic farming and improve soil health",
        features: "Financial assistance of ₹50,000 per hectare for organic farming over 3 years",
        eligibility: "Farmer groups of at least 50 farmers with 50 acres of land",
        link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
    }
];

const demoUser = {
    username: "Rajesh Kumar",
    email: "demo@kisanvikas.com",
    password: "demo123",
    location: "Pune, Maharashtra",
    landSize: 5,
    crops: "Wheat, Rice, Sugarcane",
    photo: "default.png",
    appliedSchemes: ["PM-KISAN", "Soil Health Card Scheme", "Kisan Credit Card (KCC)"],
    eligibleSchemes: ["Pradhan Mantri Fasal Bima Yojana (PMFBY)", "PM Krishi Sinchayee Yojana (PMKSY)", "Farm Mechanization Scheme"]
};

async function seed() {
    try {
        // Clear existing data
        await Scheme.deleteMany({});
        console.log("Cleared existing schemes");

        // Seed schemes
        await Scheme.insertMany(schemes);
        console.log(`Seeded ${schemes.length} government schemes`);

        // Seed demo user (clear and recreate)
        await User.deleteMany({ email: demoUser.email });
        const user = new User(demoUser);
        await user.save();
        console.log(`Seeded demo user: ${demoUser.email} / ${demoUser.password}`);

        console.log("\nSeeding complete! You can now start the server.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

// Wait for connection then seed
mongoose.connection.once("open", seed);
