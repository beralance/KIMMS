import { getIslandGroupByRegionCode } from "./locationChecker";


const MINIMUM_PER_KILO = 155;
const ADD_PER_KILO_1_TO_5 = 20;
const ADD_PER_KILO_6_TO_10 = 60;

export function calculateInterIslandShipping(product, user) {

    console.log('INSIDE HELPER: product ', product)
    console.log('INSIDE HELPER: user ', user)

    const userRegion = user.address?.region
    console.log('INSIDE HELPER: region', userRegion)
    const islandGroup = getIslandGroupByRegionCode(userRegion)
    console.log('INSIDE HELPER: region check', islandGroup)
    if (!islandGroup) return 0;

    let total = MINIMUM_PER_KILO;
    const weight = product.weight || 1
    console.log('INSIDE HELPER: weight ', weight)


    if (weight <= 5) {
        total += (weight - 1) * ADD_PER_KILO_1_TO_5
    }
    else if (weight > 5 && weight <= 10) {
        total += (5 - 1) * ADD_PER_KILO_1_TO_5;
        total += (weight - 5) * ADD_PER_KILO_6_TO_10
    }

    if (islandGroup === 'Visayas') {
        total += 25;
    }
    else if (islandGroup === 'Mindanao') {
        total += 35
    }

    console.log('INSIDE HELPER: total fee =', total)

    return total
}