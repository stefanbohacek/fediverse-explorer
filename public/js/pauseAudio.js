export default () => {
  document.addEventListener(
    "play",
    (e) => {
      const audios = document.getElementsByTagName("audio");
      for (let i = 0, len = audios.length; i < len; i++) {
        if (audios[i] != e.target) {
          audios[i].pause();
        }
      }
    },
    true
  );
};
