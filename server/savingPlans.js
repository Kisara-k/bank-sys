function calculateSavingPlan(birthday) {
    let plan_id=1;

    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if(age<=12)
        plan_id=1;
    else if(age>12 && age<=18)
        plan_id=2;
    else if(18<age && age<60)
        plan_id=3;
    else
        plan_id=4;

    return plan_id;
}

module.exports=calculateSavingPlan;