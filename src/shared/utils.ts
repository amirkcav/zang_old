export default class Utils {
  
  static wrapValues(obj: any): any { 
    // const newObj = {};
    Object.keys(obj).forEach((p) => {
      if (!obj[p]['value']) {
        obj[p] = { 'value': obj[p] };
      }
      else {
        // newObj[p] = obj[p];
      }
    });

    return obj;
  }

}
