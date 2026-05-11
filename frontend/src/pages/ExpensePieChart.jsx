import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
];

const ExpensePieChart = ({ expenses = [] }) => {
  // Group expenses by category and calculate totals
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    const existing = acc.find(item => item.name === category);
    
    if (existing) {
      existing.value += Number(expense.amount || 0);
    } else {
      acc.push({ name: category, value: Number(expense.amount || 0) });
    }
    
    return acc;
  }, []);

  // Sort by value descending for better visualization
  categoryData.sort((a, b) => b.value - a.value);

  if (categoryData.length === 0) {
    return (
      <div className="pie-chart-container">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No expenses to display
        </p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => 
              `${name}: $${value.toFixed(2)} (${(percent * 100).toFixed(1)}%)`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => `${label}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => `${entry.payload.name}: $${entry.payload.value.toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
