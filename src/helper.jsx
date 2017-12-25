export const DINING_HALLS = {
  'ovt': 'OceanView Terrace',
  'cv': 'Canyon Vista',
  '64degrees': '64 Degrees',
  'cafev': 'Cafe Ventanas',
  'foodworx': 'Foodworx',
  'pines': 'Pines'
};

export function insertion_sort(arr) {
  function value(val) {  
    switch(val) {
      case 'breakfast':
        return -1;
      case 'lunch':
        return 0;
      case 'dinner':
        return 1;
      default:
        return 2;
    }
  }


  for(let i = 1; i< arr.length; i++) {
    let key = arr[i];
    // saving second index state for later use
    let j = 0;
    for(j = i-1; j >= 0 && value(arr[j]) > value(key); j--) {
      // finding when we hit a value smaller than us and 
      // incrementing everything above us up one to make space
      arr[j+1] = arr[j];
    }
    // replace the new spot with us
    arr[j+1] = key;
  }
  return arr;
}

