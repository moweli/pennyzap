1. **Overall App Layout**
2. **Home Page**
3. **Core FIRE Projections Page**
4. **Investment Portfolio Optimizer Page**
5. **Withdrawal Strategy Planner Page**
6. **Shared Components and Considerations**

---

## **1. Overall App Layout**

The overall layout includes common components that appear on every page:

- **Header**: Contains the logo and main navigation menu.
- **Footer**: Contains additional navigation links and company information.
- **Main Content Area**: Where page-specific content is displayed.

In Next.js, you can create a `Layout` component to wrap around your page content, ensuring consistency across pages.

### **1.1. Layout Component (`components/Layout.js`)**

```jsx
// components/Layout.js

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
```

### **1.2. Header Component (`components/Header.js`)**

- **Logo**: Clicking the logo returns the user to the home page.
- **Navigation Menu**: Links to the main modules and other important pages.

```jsx
// components/Header.js

import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <Link href="/">
            <a>PennyZap</a>
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/core-fire-projections">
                <a>Core FIRE Projections</a>
              </Link>
            </li>
            <li>
              <Link href="/investment-portfolio-optimizer">
                <a>Investment Portfolio Optimizer</a>
              </Link>
            </li>
            <li>
              <Link href="/withdrawal-strategy-planner">
                <a>Withdrawal Strategy Planner</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### **1.3. Footer Component (`components/Footer.js`)**

- **Quick Links**: About Us, Contact, Privacy Policy, Terms of Service.
- **Social Media Icons**: Links to social media profiles.
- **Newsletter Signup**: (Optional) Form for users to subscribe.

```jsx
// components/Footer.js

import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="container footer-container">
        <div className="footer-links">
          <ul>
            <li>
              <Link href="/about">
                <a>About Us</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a>Contact</a>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service">
                <a>Terms of Service</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-social">{/* Social media icons */}</div>
        <div className="footer-copy">
          <p>
            &copy; {new Date().getFullYear()} PennyZap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## **2. Home Page (`pages/index.js`)**

### **Components**

- **Hero Section**: Eye-catching banner with a headline, subheadline, and a call-to-action button.
- **Features Section**: Brief overview of each module with links to their pages.
- **Testimonials**: (Optional) Social proof from users.
- **Newsletter Signup**: (Optional) Encourage users to subscribe.

### **Structure**

```jsx
// pages/index.js

import Layout from "../components/Layout";
import Link from "next/link";

const HomePage = () => {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <h1>PennyZap FIRE Master Calculator</h1>
          <p>Your journey to financial independence starts here.</p>
          <Link href="/core-fire-projections">
            <a className="btn btn-primary">Get Started</a>
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Explore Our Tools</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>Core FIRE Projections</h3>
              <p>Calculate when you can achieve financial independence.</p>
              <Link href="/core-fire-projections">
                <a className="btn btn-secondary">Learn More</a>
              </Link>
            </div>
            <div className="feature-item">
              <h3>Investment Portfolio Optimizer</h3>
              <p>Optimize your investments for better returns.</p>
              <Link href="/investment-portfolio-optimizer">
                <a className="btn btn-secondary">Learn More</a>
              </Link>
            </div>
            <div className="feature-item">
              <h3>Withdrawal Strategy Planner</h3>
              <p>Plan how to sustainably withdraw your savings.</p>
              <Link href="/withdrawal-strategy-planner">
                <a className="btn btn-secondary">Learn More</a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections like testimonials or newsletter signup can be added here */}
    </Layout>
  );
};

export default HomePage;
```

---

## **3. Core FIRE Projections Page (`pages/core-fire-projections.js`)**

### **Components**

- **Page Header**: Title and brief introduction.
- **Input Form**: Collect user inputs required for projections.
- **Results Section**: Display calculated projections.
- **Visualization**: Charts/graphs showing savings growth over time.
- **Help Tooltips**: Provide explanations for input fields.

### **Structure**

```jsx
// pages/core-fire-projections.js

import Layout from "../components/Layout";
import FireProjectionsForm from "../components/FireProjectionsForm";
import FireProjectionsResults from "../components/FireProjectionsResults";
import { useState } from "react";

const CoreFireProjectionsPage = () => {
  const [formData, setFormData] = useState(null);

  return (
    <Layout>
      <section className="page-header">
        <div className="container">
          <h1>Core FIRE Projections</h1>
          <p>Calculate your path to financial independence.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <FireProjectionsForm setFormData={setFormData} />
          {formData && <FireProjectionsResults formData={formData} />}
        </div>
      </section>
    </Layout>
  );
};

export default CoreFireProjectionsPage;
```

### **3.1. FireProjectionsForm Component**

- **Fields**: Current age, target retirement age, current savings, income, expenses, expected returns, etc.
- **Validation**: Ensure valid input values.
- **Submit Button**: To calculate projections.

```jsx
// components/FireProjectionsForm.js

import { useState } from "react";

const FireProjectionsForm = ({ setFormData }) => {
  const [inputs, setInputs] = useState({
    currentAge: "",
    retirementAge: "",
    currentSavings: "",
    annualIncome: "",
    annualExpenses: "",
    savingsRate: "",
    expectedReturn: "",
    inflationRate: "",
  });

  const handleChange = (e) => {
    // Update inputs state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and set formData
    setFormData(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields with labels and tooltips */}
      <button type="submit" className="btn btn-primary">
        Calculate
      </button>
    </form>
  );
};

export default FireProjectionsForm;
```

### **3.2. FireProjectionsResults Component**

- **Display**: Years until FIRE, required savings rate, total projected savings.
- **Graphs**: Savings growth over time.
- **Recommendations**: Suggestions based on results.

```jsx
// components/FireProjectionsResults.js

import { useEffect, useState } from "react";

const FireProjectionsResults = ({ formData }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Perform calculations based on formData
    const calculatedResults = performCalculations(formData);
    setResults(calculatedResults);
  }, [formData]);

  return <div className="results">{/* Display results and charts */}</div>;
};

export default FireProjectionsResults;
```

---

## **4. Investment Portfolio Optimizer Page (`pages/investment-portfolio-optimizer.js`)**

### **Components**

- **Page Header**: Title and brief introduction.
- **Portfolio Input Form**: Collect current portfolio details and preferences.
- **Optimization Results**: Display recommended portfolio and projections.
- **Comparison Charts**: Visual comparison between current and optimized portfolios.
- **Educational Content**: Brief explanations of investment concepts.

### **Structure**

```jsx
// pages/investment-portfolio-optimizer.js

import Layout from "../components/Layout";
import PortfolioOptimizerForm from "../components/PortfolioOptimizerForm";
import PortfolioOptimizerResults from "../components/PortfolioOptimizerResults";
import { useState } from "react";

const InvestmentPortfolioOptimizerPage = () => {
  const [portfolioData, setPortfolioData] = useState(null);

  return (
    <Layout>
      <section className="page-header">
        <div className="container">
          <h1>Investment Portfolio Optimizer</h1>
          <p>Optimize your investment strategy.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <PortfolioOptimizerForm setPortfolioData={setPortfolioData} />
          {portfolioData && (
            <PortfolioOptimizerResults portfolioData={portfolioData} />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default InvestmentPortfolioOptimizerPage;
```

### **4.1. PortfolioOptimizerForm Component**

- **Fields**: Current allocation, risk tolerance, time horizon, investment preferences.
- **Sliders or Dropdowns**: For selecting risk tolerance levels.
- **Submit Button**: To perform optimization.

```jsx
// components/PortfolioOptimizerForm.js

import { useState } from "react";

const PortfolioOptimizerForm = ({ setPortfolioData }) => {
  const [inputs, setInputs] = useState({
    stocksPercentage: "",
    bondsPercentage: "",
    cashPercentage: "",
    riskTolerance: "medium",
    timeHorizon: "",
  });

  const handleChange = (e) => {
    // Update inputs state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and set portfolioData
    setPortfolioData(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields with labels */}
      <button type="submit" className="btn btn-primary">
        Optimize
      </button>
    </form>
  );
};

export default PortfolioOptimizerForm;
```

### **4.2. PortfolioOptimizerResults Component**

- **Display**: Recommended asset allocation.
- **Charts**: Pie charts or bar graphs comparing current and recommended portfolios.
- **Impact Analysis**: Show potential improvements in returns.

```jsx
// components/PortfolioOptimizerResults.js

import { useEffect, useState } from "react";

const PortfolioOptimizerResults = ({ portfolioData }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Perform optimization based on portfolioData
    const optimizedResults = optimizePortfolio(portfolioData);
    setResults(optimizedResults);
  }, [portfolioData]);

  return (
    <div className="results">
      {/* Display optimization results and charts */}
    </div>
  );
};

export default PortfolioOptimizerResults;
```

---

## **5. Withdrawal Strategy Planner Page (`pages/withdrawal-strategy-planner.js`)**

### **Components**

- **Page Header**: Title and brief introduction.
- **Withdrawal Input Form**: Collect retirement details.
- **Strategy Results**: Display safe withdrawal rates and projections.
- **Graphs**: Show portfolio balance over retirement years.
- **Risk Assessment**: Indicate the sustainability of different strategies.

### **Structure**

```jsx
// pages/withdrawal-strategy-planner.js

import Layout from "../components/Layout";
import WithdrawalPlannerForm from "../components/WithdrawalPlannerForm";
import WithdrawalPlannerResults from "../components/WithdrawalPlannerResults";
import { useState } from "react";

const WithdrawalStrategyPlannerPage = () => {
  const [withdrawalData, setWithdrawalData] = useState(null);

  return (
    <Layout>
      <section className="page-header">
        <div className="container">
          <h1>Withdrawal Strategy Planner</h1>
          <p>Plan your retirement withdrawals wisely.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <WithdrawalPlannerForm setWithdrawalData={setWithdrawalData} />
          {withdrawalData && (
            <WithdrawalPlannerResults withdrawalData={withdrawalData} />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default WithdrawalStrategyPlannerPage;
```

### **5.1. WithdrawalPlannerForm Component**

- **Fields**: Projected portfolio size, retirement duration, annual expenses.
- **Strategy Options**: Allow users to select different withdrawal strategies.
- **Submit Button**: To calculate withdrawal plans.

```jsx
// components/WithdrawalPlannerForm.js

import { useState } from "react";

const WithdrawalPlannerForm = ({ setWithdrawalData }) => {
  const [inputs, setInputs] = useState({
    portfolioSize: "",
    retirementYears: "",
    annualExpenses: "",
    withdrawalStrategy: "4_percent_rule",
  });

  const handleChange = (e) => {
    // Update inputs state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and set withdrawalData
    setWithdrawalData(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields with labels */}
      <button type="submit" className="btn btn-primary">
        Calculate
      </button>
    </form>
  );
};

export default WithdrawalPlannerForm;
```

### **5.2. WithdrawalPlannerResults Component**

- **Display**: Safe withdrawal rates, projected portfolio balance over time.
- **Graphs**: Line charts showing portfolio depletion.
- **Risk Analysis**: Indicate probability of funds lasting throughout retirement.

```jsx
// components/WithdrawalPlannerResults.js

import { useEffect, useState } from "react";

const WithdrawalPlannerResults = ({ withdrawalData }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Calculate withdrawal strategies based on withdrawalData
    const strategyResults = calculateWithdrawalStrategies(withdrawalData);
    setResults(strategyResults);
  }, [withdrawalData]);

  return (
    <div className="results">{/* Display strategy results and graphs */}</div>
  );
};

export default WithdrawalPlannerResults;
```

---

## **6. Shared Components and Considerations**

### **6.1. Reusable Form Components**

- **Input Fields**: Create reusable input components for consistency.
- **Validation Messages**: Standardize how errors are displayed.
- **Tooltips/Help Icons**: Provide additional context for form fields.

### **6.2. Buttons**

- **Primary Buttons**: For main actions.
- **Secondary Buttons**: For less prominent actions.

### **6.3. Charts and Graphs**

- **Visualization Libraries**: Use a library like Recharts or Chart.js.
- **Responsive Design**: Ensure charts are responsive.

### **6.4. Modals and Notifications**

- **Information Modals**: For displaying additional information.
- **Success/Error Notifications**: Provide feedback after form submissions.

---

## **7. Navigation Flow**

- **Header Navigation**: Persistent navigation in the header.
- **Footer Navigation**: Additional links in the footer.
- **Breadcrumbs**: (Optional) Show user's current location within the app.

---

## **8. Responsive Design Considerations**

- **Mobile-Friendly Layouts**: Ensure components stack appropriately on smaller screens.
- **Touch Targets**: Make buttons large enough for touch interaction.
- **Font Sizes**: Adjust font sizes for readability.

---

## **9. Accessibility Considerations**

- **Semantic HTML**: Use proper HTML elements.
- **ARIA Attributes**: Enhance components with ARIA roles and labels.
- **Keyboard Navigation**: Ensure all interactive elements are focusable.
- **Contrast Ratios**: Use accessible color schemes.

---

## **10. Styling and Theming**

- **CSS Modules or Styled Components**: For modular and reusable styles.
- **Global Styles**: Define global styles for base elements.
- **Theming**: Use a theme provider if you plan to support multiple themes (e.g., light and dark modes).

---

## **11. SEO Considerations**

- **Meta Tags**: Include relevant meta tags in the `<Head>` component.
- **Page Titles**: Set descriptive titles for each page.
- **Accessible URLs**: Use clear and descriptive URLs.

---

## **12. Folder Structure**

Organize your project files for maintainability.

```
pennyzap-app/
├── components/
│   ├── Layout.js
│   ├── Header.js
│   ├── Footer.js
│   ├── FireProjectionsForm.js
│   ├── FireProjectionsResults.js
│   ├── PortfolioOptimizerForm.js
│   ├── PortfolioOptimizerResults.js
│   ├── WithdrawalPlannerForm.js
│   └── WithdrawalPlannerResults.js
├── pages/
│   ├── index.js
│   ├── core-fire-projections.js
│   ├── investment-portfolio-optimizer.js
│   ├── withdrawal-strategy-planner.js
│   ├── about.js
│   ├── contact.js
│   ├── privacy-policy.js
│   └── terms-of-service.js
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── utils/
│   └── calculations.js
└── package.json
```

---

## **13. State Management**

For managing state across components:

- **Local State**: Use React's `useState` and `useEffect` hooks.
- **Context API**: If you need to share state between distant components.
- **External Libraries**: Consider Redux or MobX for complex state management needs.

---

## **14. Utility Functions (`utils/calculations.js`)**

Create a utility file for financial calculations:

```javascript
// utils/calculations.js

export const performCalculations = (formData) => {
  // Implement FIRE projection calculations
};

export const optimizePortfolio = (portfolioData) => {
  // Implement portfolio optimization logic
};

export const calculateWithdrawalStrategies = (withdrawalData) => {
  // Implement withdrawal strategy calculations
};
```

---
