// CustomerDiet.jsx — Diet plans catalog and detail views for customers
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dietPlans } from '../../data/staticData';

const defaultDietPlans = [
  {
    id: 'weight-loss',
    type: 'weight-loss',
    title: 'Weight Loss Plan',
    icon: '🥗',
    calories: '1600 - 1800 kcal',
    description: 'High-fiber, lean-protein nutritional guideline designed for healthy, steady fat loss.',
    meals: [
      {
        meal: 'Breakfast',
        items: ['Oatmeal with berries and chia seeds', 'Boiled egg whites (2-3)', 'Green tea without sugar']
      },
      {
        meal: 'Mid-Morning Snack',
        items: ['Handful of raw almonds (15-20g)', '1 fresh apple or pear']
      },
      {
        meal: 'Lunch',
        items: ['Grilled chicken breast or tofu salad', '1 cup quinoa or brown rice', 'Mixed green leafy vegetables with olive oil']
      },
      {
        meal: 'Evening Snack',
        items: ['Roasted chickpeas', 'Cucumber slices with hummus']
      },
      {
        meal: 'Dinner',
        items: ['Steamed fish or lentil soup', 'Large bowl of stir-fried vegetables', 'Warm chamomile tea']
      }
    ],
    tips: [
      'Drink at least 3 liters of water throughout the day.',
      'Avoid sugary sodas, refined syrups, and processed snacks.',
      'Finish your dinner at least 2 hours prior to sleeping.'
    ]
  },
  {
    id: 'weight-gain',
    type: 'weight-gain',
    title: 'Weight Gain Plan',
    icon: '🥑',
    calories: '2800 - 3200 kcal',
    description: 'Calorie-dense, nutrient-rich meals focusing on clean carbs, healthy fats, and high protein.',
    meals: [
      {
        meal: 'Breakfast',
        items: ['High-calorie banana peanut butter smoothie', '4 whole eggs omelette with toast', 'Glass of whole milk']
      },
      {
        meal: 'Mid-Morning Snack',
        items: ['Trail mix (nuts, seeds, dried figs)', 'Greek yogurt with honey']
      },
      {
        meal: 'Lunch',
        items: ['Double chicken breast / paneer curry', '2 cups cooked rice', 'Steamed broccoli and sweet potato']
      },
      {
        meal: 'Evening Snack',
        items: ['Peanut butter & jelly whole wheat sandwich', 'Protein shake with milk']
      },
      {
        meal: 'Dinner',
        items: ['Grilled steak, salmon or mixed bean stew', 'Baked potatoes with sour cream', 'Mixed vegetable salad']
      }
    ],
    tips: [
      'Eat every 2.5 to 3 hours to maintain a steady caloric surplus.',
      'Opt for nutrient-dense healthy fats like avocados, nuts, and olive oil.',
      'Prioritize liquid calories such as smoothies if feeling full.'
    ]
  },
  {
    id: 'muscle-gain',
    type: 'muscle-gain',
    title: 'Muscle Gain Plan',
    icon: '🥩',
    calories: '2400 - 2700 kcal',
    description: 'Optimal macronutrient balance with high protein for muscle protein synthesis and recovery.',
    meals: [
      {
        meal: 'Breakfast',
        items: ['Egg whites & whole eggs scramble (4 eggs)', 'Rolled oats with whey protein scoop', 'Sliced banana']
      },
      {
        meal: 'Pre-Workout Snack',
        items: ['Rice cakes with natural peanut butter', '1 cup black coffee']
      },
      {
        meal: 'Post-Workout',
        items: ['1 scoop Whey Protein Isolate with water', '1 medium banana or dextrose']
      },
      {
        meal: 'Lunch',
        items: ['Grilled lean chicken breast / tempeh (200g)', '1.5 cups brown basmati rice', 'Sautéed asparagus & bell peppers']
      },
      {
        meal: 'Dinner',
        items: ['Pan-seared salmon fillet or cottage cheese', 'Mashed sweet potatoes', 'Steamed green beans']
      }
    ],
    tips: [
      'Aim for 1.6g to 2.2g of protein per kg of bodyweight.',
      'Consume protein evenly spaced across 4 to 5 meals.',
      'Stay hydrated to assist muscle repair and nutrient absorption.'
    ]
  },
  {
    id: 'maintenance',
    type: 'maintenance',
    title: 'Maintenance Plan',
    icon: '⚖️',
    calories: '2000 - 2200 kcal',
    description: 'Balanced whole-food nutrition for energy, stamina, metabolic health, and general wellness.',
    meals: [
      {
        meal: 'Breakfast',
        items: ['Scrambled eggs on sourdough toast', 'Avocado slices', 'Fresh orange or seasonal fruit']
      },
      {
        meal: 'Mid-Morning Snack',
        items: ['Plain greek yogurt with crushed walnuts and berries']
      },
      {
        meal: 'Lunch',
        items: ['Mediterranean chicken wrap or falafel bowl', 'Side Greek salad with feta cheese', 'Quinoa bowl']
      },
      {
        meal: 'Evening Snack',
        items: ['Spiced roasted edamame or almonds', 'Herbal green tea']
      },
      {
        meal: 'Dinner',
        items: ['Baked chicken thigh or grilled tofu', 'Roasted seasonal vegetables', 'Small baked potato']
      }
    ],
    tips: [
      'Focus on a colorful variety of seasonal fruits and vegetables.',
      'Maintain consistent meal timings throughout the week.',
      'Listen to natural satiety cues and maintain active daily movement.'
    ]
  }
];

export default function CustomerDiet() {
  const { type } = useParams();

  // Normalize diet plans from staticData or default data
  const normalizedPlans = useMemo(() => {
    if (Array.isArray(dietPlans) && dietPlans.length > 0) {
      return dietPlans;
    }
    if (dietPlans && typeof dietPlans === 'object') {
      return Object.entries(dietPlans).map(([key, value]) => ({
        id: key,
        type: key,
        ...value
      }));
    }
    return defaultDietPlans;
  }, []);

  // Check if a specific diet plan is requested
  const selectedPlan = useMemo(() => {
    if (!type) return null;
    return normalizedPlans.find((p) => {
      const planType = p.type || p.id || p.slug || (p.title && p.title.toLowerCase().replace(/\s+/g, '-'));
      return planType === type;
    });
  }, [type, normalizedPlans]);

  // Detail View
  if (type) {
    if (!selectedPlan) {
      return (
        <div>
          <Link to="/app/diet" className="back-link">
            ← Back to Diet Plans
          </Link>
          <div className="card not-found" style={{ marginTop: '20px' }}>
            <h2>Diet Plan Not Found</h2>
            <p>The requested diet plan could not be located.</p>
            <Link to="/app/diet" className="btn btn-primary">
              View All Diet Plans
            </Link>
          </div>
        </div>
      );
    }

    const mealSections = Array.isArray(selectedPlan.meals)
      ? selectedPlan.meals
      : selectedPlan.meals && typeof selectedPlan.meals === 'object'
      ? Object.entries(selectedPlan.meals).map(([mealName, items]) => ({
          meal: mealName,
          items: Array.isArray(items) ? items : [items]
        }))
      : selectedPlan.items
      ? [{ meal: 'Recommended Meals', items: selectedPlan.items }]
      : [];

    return (
      <div className="diet-detail">
        <Link to="/app/diet" className="back-link">
          ← Back to Diet Plans
        </Link>

        <div className="card" style={{ marginTop: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <span style={{ fontSize: '3rem' }}>{selectedPlan.icon || '🥗'}</span>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                {selectedPlan.title}
              </h2>
              {selectedPlan.calories && (
                <span className="badge badge-standard" style={{ marginTop: '6px' }}>
                  Target: {selectedPlan.calories}
                </span>
              )}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {selectedPlan.description}
          </p>
        </div>

        {/* Meal sections */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="section-title">
            <h2>Daily Meal Schedule</h2>
          </div>

          {mealSections.map((sec, idx) => (
            <div key={idx} className="meal-section">
              <h3>
                <span>🍴</span>
                {sec.meal || `Meal ${idx + 1}`}
              </h3>
              <ul className="meal-list">
                {(sec.items || []).map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Nutritional guidelines & tips */}
        {selectedPlan.tips && selectedPlan.tips.length > 0 && (
          <div className="card">
            <div className="section-title">
              <h2>Dietary Guidelines & Tips</h2>
            </div>
            <ul className="meal-list">
              {selectedPlan.tips.map((tip, idx) => (
                <li key={idx}>💡 {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Catalog View
  return (
    <div>
      <div className="page-header">
        <h2>Diet & Nutrition Plans</h2>
        <p>Curated meal guidelines tailored for different fitness targets and lifestyle goals.</p>
      </div>

      <div className="diet-grid">
        {normalizedPlans.map((plan) => {
          const planKey =
            plan.type || plan.id || plan.slug || (plan.title && plan.title.toLowerCase().replace(/\s+/g, '-'));

          return (
            <Link
              key={planKey}
              to={`/app/diet/${planKey}`}
              className="card diet-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="diet-icon">{plan.icon || '🥗'}</div>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              {plan.calories && (
                <div style={{ marginTop: '12px' }}>
                  <span className="badge badge-basic">{plan.calories}</span>
                </div>
              )}
              <div style={{ marginTop: '14px' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem' }}>
                  View Full Schedule →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
