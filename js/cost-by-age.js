/**
 * Created by doebo on 2/22/2017.
 */
let numInfants = function() {
    return number_of_infants;
};

let numPreschoolers= function() {
    return number_of_preschoolers;
};

let numSchoolagers= function() {
    return number_of_schoolagers;
};

let numTeenagers = function() {
    return number_of_teenagers;
};

let numAdults = function() {
    return number_of_adults;
};

let childCareAnnualTotal = function () {
    if (childcare_needed_bool) {
        return childCareAnnualInfant() +
            childCareAnnualPreschooler() +
            childCareAnnualSchoolager()
    } else return 0;
};

let childCareAnnualInfant = function () {
    if (use_family_care_bool) {
        return familyCareAnnualInfant();
    } else return centerCareAnnualInfant();
};

let childCareAnnualPreschooler = function () {
    if (use_family_care_bool) {
        return familyCareAnnualPreschooler();
    } else return centerCareAnnualPreschooler();
};

let childCareAnnualSchoolager = function () {
    if (use_family_care_bool) {
        return familyCareAnnualSchoolager();
    } else return centerCareAnnualSchoolager();
};

let foodAnnualInfant = function () {
    return low_cost_food_plan_price_per_mo_weber_county_infant * 12 * number_of_infants;
};

let foodAnnualPreschooler = function () {
    return low_cost_food_plan_price_per_mo_weber_county_preschooler * 12 * number_of_preschoolers;
};

let foodAnnualSchoolager = function () {
    return low_cost_food_plan_price_per_mo_weber_county_schoolager * 12 * number_of_schoolagers;
};

let foodAnnualTeenager = function () {
    return low_cost_food_plan_price_per_mo_weber_county_teenager * 12 * number_of_teenagers;
};

let foodAnnualAdult = function () {
    return low_cost_food_plan_price_per_mo_weber_county_adult * 12 * number_of_adults;
};

let numChildren = function () {
    return number_of_infants + number_of_preschoolers + number_of_schoolagers + number_of_teenagers
};

let familySize = function () {
    return number_of_infants + number_of_preschoolers + number_of_schoolagers + number_of_teenagers + number_of_adults
};

let excessiveChildren = function () {
    numChildren = numChildren();
    return Math.max(0, numChildren - 5);
};

//B12
let excessiveAdults = function () {
    return Math.max(0, number_of_adults - 5);
};

// B14
let numCars = function () {
    if (number_of_cars == -1) return number_of_adults;
    else return number_of_cars;
};

let overallCost = function() {  // -1 == 'Standard'
    return    (number_of_bedrooms == -1 ? housingCost() :
                (number_of_bedrooms == 1 ? annualOneBedAverage() :
                        (number_of_bedrooms == 2 ? annualTwoBedAverage() :
                                (number_of_bedrooms == 3 ? annualThreeBedAverage() :
                                        (number_of_bedrooms == 4 ? annualFourBedAverage() :
                                                0
                                        )
                                )
                        )
                )
        ) +
        (estimated_babysitting_cost > 0 ? estimated_babysitting_cost :
                (use_family_care_bool == true ? familyChildCareCost() :
                        childCareAnnualTotal()
                )
        ) +
        carInsurance() +
        carOwnership() +
        (use_marketplace_health_insurance_bool == false ? healthCareEmployerCombinedTotal() : totalMarketplaceHealthCareCost()) +
        entertainmentCost() +
        miscCost() +
        excessiveChildrenCost() +
        excessiveAdultsCost() +
        publicTransitCost() +
        foodCostAnnualTotal()
};

let housingCost = function () {
    let total = 0;
    let beds = 0;
    if (number_of_bedrooms == -1) {
        beds = Math.ceil(number_of_adults / 2) + Math.ceil(numChildren() / 2)
    }
    else beds = number_of_bedrooms;

    if (beds == 1) {
        total =
            housing_1_bed_84401 +
            housing_1_bed_84403 +
            housing_1_bed_84404 +
            housing_1_bed_84405 +
            housing_1_bed_84408;
    }
    else if (beds == 2) {
        total =
            housing_2_bed_84401 +
            housing_2_bed_84403 +
            housing_2_bed_84404 +
            housing_2_bed_84405 +
            housing_2_bed_84408;
    } else if (beds == 3) {
        total =
            housing_3_bed_84401 +
            housing_3_bed_84403 +
            housing_3_bed_84404 +
            housing_3_bed_84405 +
            housing_3_bed_84408;
    } else if (beds == 4) {
        total =
            housing_4_bed_84401 +
            housing_4_bed_84403 +
            housing_4_bed_84404 +
            housing_4_bed_84405 +
            housing_4_bed_84408;
    }

    return total / 5;
};

let foodCostAnnualTotal = function () {
    return foodAnnualAdult() +
        foodAnnualInfant() +
        foodAnnualPreschooler() +
        foodAnnualSchoolager() +
        foodAnnualTeenager()
};

let carInsurance = function() {
    return numCars() * car_insurance_avg_per_mo_single;
};