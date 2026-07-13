import express from "express";
import {Router} from "express";
import { db } from "./config.js";
export const analyticsRouter = Router();

analyticsRouter.get("/stats",async(req,res)=>{
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
analyticsRouter.get("/category-breakdown",async(req,res)=>{
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


