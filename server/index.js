import express from "express";
import axios from "axios";
import cors from "cors";
import pg from "pg";
import {Pool} from "pg";
const app = express();
const PORT = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Expenses",
  password: "123456",
  port: 5432,
});
db.connect();
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TRANSACTIONS 
app.get("/expenses",async (req,res)=>{
    try{
        const response = await db.query("SELECT * FROM users_expenses ORDER BY created_date DESC")
       
        const result = response.rows;

        
        res.status(200).json({
            
           success:true,
           data:result
            
        })
    }catch(err){
        console.log(err.message);
       res.status(500).json({

        success:false,
        error:err.message
       })
    }
})
app.post("/api/expenses", async (req, res) => {
  try {
    const { user_id, amount, category, description, created_date } = req.body;
     console.log(req.body)
    if (!user_id || !amount || !description || !category || !created_date) {
      console.log("Please fill all required fields")
      return res.status(400).json({
        success: false,
        message: "Please fill out all fields properly."
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      console.log("negative amount entered")
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0."
      });
      return;
    }
   
    

    const insertExpenseQuery = `
      INSERT INTO users_expenses (user_id, amount, category, description, created_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING expense_id, user_id, amount, category, description, created_date;
    `;

    const result = await db.query(insertExpenseQuery, [
      user_id || 2, 
      amount, 
      category, 
      description, 
      created_date
    ]);

    res.status(201).json({
      success: true,
      message: "Transaction logged securely!",
      // newData: result.rows[0]
    });

  } catch (err) {
    console.error("Database insert error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/analytics/stats",async(req,res)=>{
    try{
      const expenses = await db.query("SELECT SUM(amount) AS expense_total, AVG(amount) AS average_expense FROM users_expenses WHERE category!='Income';")
    const income = await db.query("SELECT SUM(amount) AS income_total FROM users_expenses WHERE category='Income';")
    const stats = {
        income:income.rows[0].income_total,
        expense:expenses.rows[0].expense_total,
        savings: income.rows[0].income_total-expenses.rows[0].expense_total,
        avgExpense : expenses.rows[0].average_expense
    }
    console.log(income.rows[0])
    res.status(200).json({
        success:true,
        stats:stats
    })
    }catch(err){
           res.status(500).json({
            success:false,
            error:err.message
           })
    }
})

app.get("/analytics/stats/category",async(req,res)=>{
    try{
    const response = await db.query("SELECT DISTINCT(category) AS name, SUM(amount::numeric) AS value FROM users_expenses WHERE category != 'Income' GROUP BY category;")
    console.log(response);
    res.status(200).json({
        success:true,
        categoryData:response.rows
    })
    }catch(err){
       res.status(500).json({
        success:false,
        error:err.message
       })
    }
})
// test route
app.post("/login", (req, res) => {
    const{name,email,password} = req.body;

    if(!name||!email||!password){
        res.json({status:301, message:"Details not filled properly "})
    }
    console.log(req.body);
    res.json({ status:200,message: "Backend working 🔥" });
});



app.get("/api/budgets",async(req,res)=>{
  const userId = 2;
  try{
    const response = await db.query("SELECT *FROM budgets WHERE user_id = $1",[userId]);
    res.status(200).json({
      success:true,
      data:response.rows
    })

  }catch(err){
res.status(500).json({
  success: false,
  error:err.message
})
  }
})

app.get("/api/budgets/dashboard", async(req,res)=>{

 try{

   const loggedInUserId = 2;

   const query = `

   SELECT
    b.budget_id AS id,

      c.name AS category,
      c.icon,

      b.budget_limit AS budget,

      COALESCE(
         SUM(e.amount),
         0
      ) AS spent,

      b.month_val,
      b.year_val,

      (
        b.budget_limit -
        COALESCE(
           SUM(e.amount),
           0
        )
      ) AS remaining

   FROM budgets b

   JOIN categories c
   ON b.category_id = c.id

   LEFT JOIN users_expenses e
   ON

      b.user_id = e.user_id

      /* expenses still use string category */
      AND c.name = e.category

      AND EXTRACT(MONTH FROM e.created_date)=b.month_val
      AND EXTRACT(YEAR FROM e.created_date)=b.year_val

   WHERE b.user_id=$1

   GROUP BY

      b.budget_id,
      c.id,
      c.name,
      c.icon,
      b.budget_limit,
      b.month_val,
      b.year_val

   ORDER BY
      b.year_val DESC,
      b.month_val DESC

   `;

   const response =
   await db.query(query,[loggedInUserId]);

   res.json({
      success:true,
      data:response.rows
   });

 }
 catch(err){

   res.status(500).json({
      success:false,
      error:err.message
   });

 }

});

app.get("/categories",async(req,res)=>{
  const response = await db.query("SELECT name AS category, id FROM categories");
  res.status(200).json({
    success:true,
    data:response.rows
  })
})

// ======================================
// POST /api/budgets - Create or Update Budget (Upsert)
// ======================================
app.post("/api/budgets", async(req,res)=>{
  const userId = 2; // In production, get from auth
  const { categoryId, budgetLimit, period, monthVal, yearVal } = req.body;

  if(!categoryId || !budgetLimit || !period || !monthVal || !yearVal){
    return res.status(400).json({
      success: false,
      error: "Missing required fields: categoryId, budgetLimit, period, monthVal, yearVal"
    });
  }

  try {
    // Check if budget already exists for this category, month, year
    const checkQuery = `
      SELECT budget_id FROM budgets 
      WHERE user_id = $1 AND category_id = $2 AND month_val = $3 AND year_val = $4
    `;
    const checkResult = await db.query(checkQuery, [userId, categoryId, monthVal, yearVal]);

    if(checkResult.rows.length > 0){
      // UPDATE existing budget
      const budgetId = checkResult.rows[0].budget_id;
      const updateQuery = `
        UPDATE budgets 
        SET budget_limit = $1, period = $2
        WHERE budget_id = $3
        RETURNING *
      `;
      const updateResult = await db.query(updateQuery, [budgetLimit, period, budgetId]);
      
      return res.json({
        success: true,
        data: updateResult.rows[0],
        message: "Budget updated successfully"
      });
    }

    // CREATE new budget
    const insertQuery = `
      INSERT INTO budgets (user_id, category_id, budget_limit, period, month_val, year_val)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const insertResult = await db.query(insertQuery, [userId, categoryId, budgetLimit, period, monthVal, yearVal]);

    res.json({
      success: true,
      data: insertResult.rows[0],
      message: "Budget created successfully"
    });

  } catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});