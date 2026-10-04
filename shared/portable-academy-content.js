(function(global){
  const GUIDES_KEY='bhakti_academy_guides_v1';
  const REFERENCES_KEY='bhakti_academy_references_v1';
  const QUESTIONS_PREFIX='bhakti-study.imported-questions.';

  const PROGRAMS=[
    'bhakti-sastri',
    'bhakti-vaibhava',
    'bhakti-vedanta',
    'bhakti-sarvabhauma',
    'sat-sandarbhas'
  ];

  let timer=null;

  function arrayValue(key){
    try{
      const value=JSON.parse(localStorage.getItem(key)||'[]');
      return Array.isArray(value)?value:[];
    }catch{
      return [];
    }
  }

  function snapshot(){
    const imported={};

    PROGRAMS.forEach(program=>{
      imported[program]=arrayValue(QUESTIONS_PREFIX+program);
    });

    return {
      format:'bhakti-study-academy-content',
      version:1,
      guides:arrayValue(GUIDES_KEY),
      references:arrayValue(REFERENCES_KEY),
      imported_questions:imported
    };
  }

  async function persist(){
    try{
      const response=await fetch('/__academy/portable-content',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(snapshot())
      });

      if(!response.ok){
        throw new Error('HTTP '+response.status);
      }

      const result=await response.json();

      if(!result.ok){
        throw new Error(result.error||'Portable save failed.');
      }

      global.dispatchEvent(new CustomEvent(
        'bhakti-portable-content-saved'
      ));
    }catch(error){
      console.warn(
        'Portable Academy content could not be updated:',
        error
      );
    }
  }

  function changed(){
    clearTimeout(timer);
    timer=setTimeout(persist,150);
  }

  global.PortableAcademyContent={
    snapshot,
    persist,
    changed
  };
})(window);
