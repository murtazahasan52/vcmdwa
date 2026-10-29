// Mirrors backend/config/event_config.py so the site still renders
// sensible content if the API hasn't loaded yet (or is briefly down).
export const fallbackConfig = {
  "eventName": "COMP-EX 2027",
  "eventShortName": "COMP-EX",
  "eventEdition": "33rd Edition",
  "eventCity": "Nagpur",
  "eventTagline": "CENTRAL INDIA'S LARGEST IT & TECHNOLOGY EXHIBITION",
  "eventDatesLabel": "February 2027 · Dates to be announced",
  "eventStartDateISO": "2027-02-04",
  "eventEndDateISO": "2027-02-07",
  "datesConfirmed": false,
  "showDays": "4",
  "venueName": "Civil Lines, Nagpur",
  "venueAddress": "Civil Lines, Nagpur, Maharashtra, India (about 1.5 km from Nagpur Railway Station)",
  "venueMapUrl": "https://www.google.com/maps/search/?api=1&query=Civil+Lines+Nagpur",
  "totalStalls": "100+",
  "organizers": [
    {
      "name": "Vidarbha Computer & Media Dealers' Welfare Association (VCMDWA)",
      "tagline": "Affiliated to FAIITA and FITAM · Est. 1991"
    }
  ],
  "association": {
    "name": "Vidarbha Computer & Media Dealers' Welfare Association",
    "short": "VCMDWA",
    "founded": "1991",
    "affiliations": [
      "FAIITA — Federation of All India IT Association",
      "FITAM — Federation of Information Technology Associations of Maharashtra"
    ],
    "award": "Recognised as \"Best IT Association\" in India by DQ Week",
    "members": "101 full members and 34 associate members from across Vidarbha",
    "address": "603, Suryakiran Complex, Plot No. 1, Central Bazaar Road, Bajaj Nagar, Nagpur – 440010",
    "website": "https://vcmdwa.org",
    "facebook": "https://www.facebook.com/vcmdwa",
    "instagram": "https://www.instagram.com/compex_nagpur",
    "team": [
      {
        "name": "Dinesh Naidu",
        "post": "President"
      },
      {
        "name": "Rohit Jaiswal",
        "post": "Vice President"
      },
      {
        "name": "Lalit Gandhi",
        "post": "Secretary"
      },
      {
        "name": "Sanjay Chaurasia",
        "post": "Joint Secretary"
      },
      {
        "name": "Jayanti Patel",
        "post": "Treasurer"
      },
      {
        "name": "Nikhil Gandhi",
        "post": "Executive Member"
      },
      {
        "name": "Mohit Parekh",
        "post": "Executive Member"
      },
      {
        "name": "Pratul Khandelwal",
        "post": "Executive Member"
      },
      {
        "name": "Altaf Chimthanawala",
        "post": "Executive Member"
      }
    ]
  },
  "mediaPartner": {
    "name": "Hayat Computers & Security Solutions",
    "city": "Nagpur",
    "phone": "+91 96738 78652",
    "role": "Media Partner · Online platform & Digital COMP-EX Directory"
  },
  "contact": {
    "phone": "+91 97309 88800",
    "whatsapp": "+91 97309 88800",
    "whatsappNote": "VCMDWA office",
    "email": "compex@vcmdwa.org",
    "emails": [
      "compex@vcmdwa.org",
      "admin@vcmdwa.org",
      "enquiry@vcmdwa.org"
    ]
  },
  "registrationDeadlines": {
    "stall": "31 December 2026",
    "visitor": "the last day of the expo (walk-ins welcome)"
  },
  "stallPackages": [
    {
      "code": "pavilion",
      "label": "Brand Pavilion",
      "icon": "🏛️",
      "rate": 450000,
      "size": "6m × 6m",
      "stallCount": 4,
      "hasStallPicker": true,
      "inclusions": "36 sq m · Island pavilion on the main aisle, maximum branding, premium furnishing"
    },
    {
      "code": "premium-corner",
      "label": "Premium Corner Stall",
      "icon": "⭐",
      "rate": 95000,
      "size": "3m × 3m",
      "stallCount": 8,
      "hasStallPicker": true,
      "inclusions": "9 sq m · Corner on the main aisle, two open sides, fascia signage, 1 table, 2 chairs, power point"
    },
    {
      "code": "premium",
      "label": "Premium Stall",
      "icon": "⭐",
      "rate": 75000,
      "size": "3m × 3m",
      "stallCount": 20,
      "hasStallPicker": true,
      "inclusions": "9 sq m · Main-aisle frontage, fascia signage, 1 table, 2 chairs, power point"
    },
    {
      "code": "regular",
      "label": "Standard Shell Stall",
      "rate": 55000,
      "size": "3m × 3m",
      "stallCount": 46,
      "hasStallPicker": true,
      "inclusions": "9 sq m · Shell scheme, fascia signage, 1 table, 2 chairs, power point"
    },
    {
      "code": "member",
      "label": "VCMDWA Member Stall",
      "icon": "🤝",
      "rate": 45000,
      "size": "3m × 3m",
      "stallCount": 24,
      "hasStallPicker": true,
      "eligibility": "Reserved for VCMDWA members — members get first preference for stall space. M1–M12 can be booked online with your membership number; M13–M24 are allotted by the stall committee.",
      "inclusions": "9 sq m · Shell scheme, fascia signage, 1 table, 2 chairs, power point"
    },
    {
      "code": "gaming-zone",
      "label": "Gaming Zone",
      "rate": null,
      "sizeLabel": "2,000 sq. ft.",
      "hasStallPicker": false,
      "inclusions": "High-powered gaming area — space and pricing discussed directly with the stall committee"
    },
    {
      "code": "food-court",
      "label": "Food Court",
      "rate": null,
      "sizeLabel": "2,500 sq. ft.",
      "hasStallPicker": false,
      "inclusions": "Food stalls — space and pricing discussed directly with the stall committee"
    }
  ],
  "totalStallsNumbered": 102,
  "categories": [
    {
      "key": "laptops-desktops",
      "label": "Laptops & Desktops"
    },
    {
      "key": "hardware-peripherals",
      "label": "Computer Hardware & Peripherals"
    },
    {
      "key": "printers-copiers",
      "label": "Printers & Copiers"
    },
    {
      "key": "networking",
      "label": "Networking & Digital Infrastructure"
    },
    {
      "key": "cctv-surveillance",
      "label": "CCTV & Surveillance"
    },
    {
      "key": "cybersecurity",
      "label": "Cybersecurity & Data Protection"
    },
    {
      "key": "cloud-ai",
      "label": "Cloud, AI & Emerging Tech"
    },
    {
      "key": "mobile-accessories",
      "label": "Mobiles & Accessories"
    },
    {
      "key": "software-services",
      "label": "Software Solutions & Services"
    },
    {
      "key": "gaming",
      "label": "Gaming & GPUs"
    },
    {
      "key": "office-automation",
      "label": "Office Automation"
    },
    {
      "key": "interactive-panels",
      "label": "Interactive Panels & AV"
    },
    {
      "key": "iot-smart-home",
      "label": "IoT & Smart Home"
    },
    {
      "key": "refurbished",
      "label": "Refurbished IT"
    },
    {
      "key": "e-governance",
      "label": "e-Governance & Public Services"
    },
    {
      "key": "education-careers",
      "label": "IT Education & Careers"
    }
  ],
  "highlights": [
    "Technology seminars and expert-led sessions",
    "Career guidance and skill-development programs for students",
    "Startup showcases and innovation platforms",
    "Cyber awareness and digital literacy programs with Nagpur Police",
    "Government e-Governance and public service initiatives",
    "High-powered Gaming Zone",
    "Launch platform for new products and services"
  ],
  "exhibitorInstructions": {
    "setupWindow": "2 days before opening, 10:00 AM – 8:00 PM (to be confirmed)",
    "moveOutWindow": "Last day, after 9:00 PM (to be confirmed)",
    "dailyShowTiming": "12:00 noon – 9:00 PM (all 4 days)",
    "documentsRequired": [
      "Valid government photo ID for all staff manning the stall",
      "GST certificate / business registration proof (for invoicing)",
      "VCMDWA membership number (for Member Stalls)"
    ],
    "guidelines": [
      "Stall fabrication must stay within your allotted footprint and height limit (2.5m unless approved otherwise).",
      "Electrical load beyond the standard power point must be requested in advance.",
      "Exhibitor badges must be worn at all times inside the expo.",
      "Demo equipment must be moved in only during the set-up window at the designated gate.",
      "All stall decor and banners must be fire-safety compliant."
    ],
    "cancellationPolicy": "Cancellations made before the registration deadline are eligible for a refund of any advance paid, as per VCMDWA terms. Cancellations after the deadline are non-refundable. (Update this policy to match your final terms.)"
  }
};
