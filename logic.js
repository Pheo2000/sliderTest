let currentIndex;
let slideLength;
let sliderParent;
let itemWidth;

const config = () => {
  currentIndex = 0;
  sliderParent = document.querySelector(".slider");
  slideLength = document
    .querySelector(".slider-list")
    .getElementsByClassName("slider-item").length;
  itemWidth = sliderParent.getBoundingClientRect().width;
};

const resizeSlider = () => {
  new ResizeObserver((entries) => {
    const sliderParentRect = entries[0].contentRect;
    itemWidth = sliderParentRect.width;
    const heightSlideItem = sliderParentRect.height;

    const sliderList = document.querySelector(".slider-list");
    const sliderItems = document.querySelectorAll(".slider-item");

    sliderItems.forEach((sliderItem) => {
      sliderItem.style.width = itemWidth + "px";
      sliderItem.style.height = heightSlideItem + "px";
    });

    handleCurrentView(currentIndex);
    sliderList.style.transitionDuration = "0ms";
  }).observe(sliderParent);
};

const handleActive = (index) => {
  if (index <= 0) {
    btnPrev.classList.add("btn_disabled");
  } else if (index >= slideLength - 1) {
    btnNext.classList.add("btn_disabled");
  } else {
    btnNext.classList.remove("btn_disabled");
    btnPrev.classList.remove("btn_disabled");
  }
};

const handleBtnNextPrev = (e) => {
  let newIndex;
  const isPrev = e === "prev";
  const isNext = e === "next";

  const disable = handleDisableBtn(isNext, isPrev);
  if (disable) return;

  if (isNext) {
    newIndex = currentIndex + 1;
  } else if (isPrev) {
    newIndex = currentIndex - 1;
  } else {
    return;
  }
  currentIndex = newIndex;
  handleActive(newIndex);
  handleCurrentView(newIndex);
};

const handleDisableBtn = (isNext, isPrev) => {
  if (isPrev && currentIndex <= 0) {
    return true;
  }
  if (isNext && currentIndex >= slideLength - 1) {
    return true;
  }
  return false;
};

const handleCurrentView = (index) => {
  const space = `-${index * itemWidth}px`;
  const slideList = sliderParent.querySelector(".slider-list");
  slideList.style.transform = `translate(${space}, 0px)`;
  slideList.style.transitionDuration = "200ms";
};

const handleEventBtn = () => {
  btnPrev = document.querySelector(".btnPrev");
  btnNext = document.querySelector(".btnNext");
  btnPrev.onclick = () => handleBtnNextPrev("prev");
  btnNext.onclick = () => handleBtnNextPrev("next");
};

const handleDrag = () => {
  let mouseStart;
  const itemSlide = document.querySelector(".slider-list");

  sliderParent.addEventListener("mousedown", (e) => {
    mouseStart = e.clientX;
  });

  sliderParent.addEventListener("mousemove", (e) => {
    let mouseCurrent = e.clientX;
    let itemSpace;
    let space;
    if (mouseCurrent > mouseStart) {
      itemSpace = mouseCurrent - mouseStart;
      space = `-${currentIndex * itemWidth - itemSpace}px`;
    } else {
      itemSpace = mouseStart - mouseCurrent;
      space = `-${currentIndex * itemWidth + itemSpace}px`;
    }

    itemSlide.style.transform = `translate(${space}, 0px)`;
    itemSlide.style.transitionDuration = "0ms";
  });

  sliderParent.addEventListener("mouseup", (e) => {
    const mouseEnd = e.clientX;
    if (mouseEnd - mouseStart > itemWidth * 0.2) {
      handleBtnNextPrev("prev");
    } else if (mouseStart - mouseEnd > itemWidth * 0.2) {
      handleBtnNextPrev("next");
    } else {
      const space = `-${currentIndex * itemWidth}px`;
      itemSlide.style.transform = `translate(${space}, 0px)`;
      itemSlide.style.transitionDuration = "200ms";
    }

    mouseStart = undefined;
  });
};

const handleTouch = (e) => {
  let touchStart;
  let touchMoveStart;
  const itemSlide = document.querySelector(".slider-list");

  sliderParent.addEventListener("touchstart", (e) => {
    touchStart = e.changedTouches[0].screenX;
  });

  sliderParent.addEventListener("touchmove", (e) => {
    touchMoveStart = e.changedTouches[0].screenX;
    let itemSpace;
    let space;
    if (touchMoveStart > touchStart) {
      itemSpace = touchMoveStart - touchStart;
      space = `-${currentIndex * itemWidth - itemSpace}px`;
    } else {
      itemSpace = touchStart - touchMoveStart;
      space = `-${currentIndex * itemWidth + itemSpace}px`;
    }

    itemSlide.style.transform = `translate(${space}, 0px)`;
    itemSlide.style.transitionDuration = "0ms";
  });

  sliderParent.addEventListener("touchend", (e) => {
    const touchEnd = e.changedTouches[0].screenX;
    if (touchEnd - touchStart > itemWidth * 0.2) {
      handleBtnNextPrev("prev");
    } else if (touchStart - touchEnd > itemWidth * 0.2) {
      handleBtnNextPrev("next");
    }else{
      const space = `-${currentIndex * itemWidth}px`;
      itemSlide.style.transform = `translate(${space}, 0px)`;
      itemSlide.style.transitionDuration = "200ms";
    }
    touchStart = undefined;
  });
};

const init = () => {
  config();
  resizeSlider();
  handleEventBtn();
  handleActive(currentIndex);
  handleDrag();
  handleTouch();
};

init();
