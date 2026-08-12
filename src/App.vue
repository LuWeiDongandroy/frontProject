<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const ready = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function scrollToAbout() {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="site" :class="{ ready }">
    <div class="sky" aria-hidden="true">
      <span class="orb orb-a" />
      <span class="orb orb-b" />
      <span class="orb orb-c" />
      <span class="trail trail-1" />
      <span class="trail trail-2" />
    </div>

    <header class="top" :class="{ scrolled }">
      <span class="mark">Troy</span>
      <nav>
        <a href="#about">简介</a>
        <a href="#motto">座右铭</a>
        <a href="#focus">方向</a>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow reveal r1">Personal Site</p>
        <h1 class="name reveal r2">会飞的特洛伊</h1>
        <p class="tagline reveal r3">AI 开发 · 把想法送上云端</p>
        <p class="lead reveal r4">
          好奇心比 deadline 跑得更快一点，喜欢把复杂问题拆开，再让好点子飞得更远。
        </p>
        <div class="cta reveal r5">
          <button type="button" @click="scrollToAbout">认识一下</button>
        </div>
      </div>

      <div class="hero-stage reveal r3" aria-hidden="true">
        <div class="gyro">
          <div class="ring ring-x" />
          <div class="ring ring-y" />
          <div class="ring ring-z" />
          <div class="core">
            <span class="core-spin">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="section about">
      <h2 class="section-title">个性速写</h2>
      <p class="section-desc">不端着，敢试错，认真做事时也很会开玩笑。</p>
      <ul class="traits">
        <li>
          <strong>飞得高</strong>
          <span>想法先起飞，再落地成可跑的代码与产品。</span>
        </li>
        <li>
          <strong>拆得开</strong>
          <span>复杂问题切成小块，一步一步啃干净。</span>
        </li>
        <li>
          <strong>聊得来</strong>
          <span>技术也好、生活也好，都能认真听，也能轻松接。</span>
        </li>
      </ul>
    </section>

    <section id="motto" class="section motto">
      <h2 class="section-title">座右铭</h2>
      <p class="section-desc">登山不畏难，写代码也一样。</p>

      <div class="motto-stage">
        <div class="carousel" aria-hidden="true">
          <div class="carousel-track">
            <div class="face face-1"><span>登攀</span></div>
            <div class="face face-2"><span>无难事</span></div>
            <div class="face face-3"><span>肯干</span></div>
            <div class="face face-4"><span>向前</span></div>
          </div>
        </div>

        <blockquote class="quote">
          <p>世上无难事，只要肯登攀</p>
          <cite>—— 毛泽东</cite>
        </blockquote>
      </div>
    </section>

    <section id="focus" class="section focus">
      <h2 class="section-title">正在做的事</h2>
      <p class="section-desc">方向专注 AI 开发，用模型与工程把灵感变成可用工具。</p>
      <div class="focus-line">
        <p class="focus-main">AI 开发</p>
        <p class="focus-sub">
          Agent、接口联调、前后端落地 —— 从原型到部署，喜欢把链路跑通。
        </p>
      </div>
    </section>

    <footer class="foot">
      <p>© {{ new Date().getFullYear() }} 会飞的特洛伊</p>
    </footer>
  </div>
</template>
