const particlesOptions = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 1500,
      },
    },
    line_linked: {
      enable: true,
      opacity: 0.04,
    },
    move: {
      direction: 'none',
      speed: 0.12,
    },
    size: {
      value: 1,
    },
    opacity: {
      anim: {
        enable: true,
        speed: 0.6,
        opacity_min: 0.05,
      },
    },
  },
  retina_detect: true,
};

export default particlesOptions;
