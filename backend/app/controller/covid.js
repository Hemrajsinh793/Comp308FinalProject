//load machine_learning module
let ml = require('machine_learning');


exports.checkConditions =  (req, res) =>{
   
    const cough = req.body.cough;
    console.log("COugh is this" ,cough);
    const fever = req.body.fever;
    console.log(fever);
    const sorethroat = req.body.sorethroat;
    console.log(sorethroat);
    const fatigue = req.body.fatigue;
    console.log(fatigue);
    const travelhistory = req.body.travelhistory;
    console.log(travelhistory);
    const incontact = req.body.incontact;
    console.log(incontact);


    let data= [
      ['no', 'no', 'no', 'no', 'no', 'no'],
      ['yes', 'no', 'no', 'no', 'no', 'no'],
      ['yes', 'yes', 'no', 'no', 'no', 'no'],
      ['no', 'yes', 'yes', 'no', 'no', 'no'],
      ['no', 'no', 'yes', 'yes', 'no', 'no'],
      //5
      ['yes', 'no', 'no', 'yes', 'yes', 'no'],
      ['no', 'yes', 'yes', 'no', 'yes', 'no'],
      ['no', 'no', 'yes', 'no', 'no', 'yes'],
      ['no', 'no', 'yes', 'no', 'no', 'yes'],
      ['no', 'no', 'yes', 'no', 'yes', 'yes'],
      //10
      ['no', 'no', 'no', 'yes', 'no', 'yes'],
      ['no', 'no', 'yes', 'yes', 'yes', 'no'],
      ['no', 'yes', 'no', 'yes', 'yes', 'no'],
      ['yes', 'no', 'yes', 'yes', 'no', 'no'],
      ['yes', 'no', 'no', 'yes', 'yes', 'no'],
      //15
      ['no', 'yes', 'no', 'no', 'no', 'yes'],
      ['yes', 'yes', 'yes', 'yes', 'yes', 'yes'],
      ['yes', 'yes', 'no', 'no', 'yes', 'no'],
      ['yes', 'no', 'yes', 'no', 'yes', 'no'],
      ['no', 'no', 'yes', 'yes', 'no', 'yes'],
      ['no', 'no', 'yes', 'no', 'no', 'no'],
      ['yes', 'no', 'no', 'yes', 'no', 'no'],
      ['yes','no','yes','yes','yes','yes'],

    ];

    //decision 
    let result= ['normal','normal','normal','normal','normal','corona','corona','corona','corona','normal',
        'corona','normal','corona','corona','normal','corona','corona','corona','corona','normal','normal','normal','corona'];


    let dt = new ml.DecisionTree({
      data: data,
      result: result
  });

  dt.build();
  console.log("here",cough,fever,fatigue,sorethroat,travelhistory,incontact);
 
  let classificationResult =  dt.classify([cough, fever, sorethroat, fatigue, travelhistory,incontact]);
  //dt.prune(1.0);

  let classsification = JSON.stringify(classificationResult);
  let classResult = classsification.substring(2, classsification.length - 4);


  let medicalAttention = '';

    if (classResult === "corona") {
        medicalAttention = 'Yes';
    } else {
        medicalAttention = "'no'";
    }


    let obj = {
      
      condition: classResult,
      attn: medicalAttention
  };
  console.log("Sending here",obj);

  return res.status(200).json(obj);

};
