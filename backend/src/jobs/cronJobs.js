import cron from "node-cron";
import * as paymentModel from "../models/payment.model.js";
import * as notificationModel from "../models/notification.model.js";

export const initCronJobs = () => {
  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running daily rent reminder check...");
    try {
      const pendingPayments = await paymentModel.getPendingPaymentsForReminders();
      
      let reminderCount = 0;
      for (const payment of pendingPayments) {
        if (!payment.owner_id) continue;
        
        // Calculate days difference
        const dueDate = new Date(payment.due_date);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let timeContext = "";
        if (diffDays < 0) {
          timeContext = `is OVERDUE by ${Math.abs(diffDays)} days`;
        } else if (diffDays === 0) {
          timeContext = `is due TODAY`;
        } else {
          timeContext = `is due in ${diffDays} days`;
        }

        const title = `Rent Reminder Needed: ${payment.houseCode}`;
        const description = `The rent payment of Rs. ${payment.amount} for ${payment.TenantName} at ${payment.houseCode} ${timeContext}. Please review and send a direct reminder to the tenant.`;

        // We avoid spamming the owner over and over by checking if a similar identical notification was created today
        // For a robust system, we would check the database before insert, 
        // but since this runs once a day, it creates exactly one notification per day for pending items.
        // As a simple deduping metric, you can track it or rely on the owner to clear/resolve notifications.
        
        await notificationModel.createNotification(
          payment.owner_id, 
          title, 
          description, 
          "New", 
          "Reminder"
        );
        reminderCount++;
      }
      
      console.log(`✅ Sent ${reminderCount} automated reminders to owners.`);
    } catch (error) {
      console.error("❌ Error running rent reminder cron job:", error);
    }
  });
  
  // Run on the 1st of every month at midnight
  cron.schedule("0 0 1 * *", async () => {
    console.log("⏰ Running monthly rent billing generation...");
    try {
      const generatedCount = await paymentModel.autoGenerateMonthlyInvoices();
      console.log(`✅ Auto-generated ${generatedCount} new rent invoices.`);
    } catch (error) {
      console.error("❌ Error auto-generating monthly invoices:", error);
    }
  });

  console.log("⏱️  Cron jobs initialized.");
};
