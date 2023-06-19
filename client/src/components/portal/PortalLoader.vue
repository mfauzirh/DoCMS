<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <v-container>
            <img src="@/assets/docmslogo.png" alt="logo" height="400" class="mb-16">
            <p class="linear-wipe">Loading your content...</p>
            <div class="animated-gradient progress-bar"></div>
        </v-container>
    </div>
</template>

<style>
.linear-wipe {
    --bg-size: 400%;
    font-weight: bold;
    background: linear-gradient(90deg,
            var(--secondary-purple),
            var(--secondary-blue),
            var(--secondary-purple)) 0 0 / var(--bg-size) 100%;
    color: transparent;
    background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
    .linear-wipe {
        animation: move-bg 8s linear infinite;
    }

    @keyframes move-bg {
        to {
            background-position: var(--bg-size) 0;
        }
    }
}

.progress-bar {
    width: 100%;
    height: 20px;
}

.animated-gradient {
    background: repeating-linear-gradient(to right, var(--secondary-purple) 0%, var(--secondary-blue) 50%, var(--secondary-purple) 100%);
    width: 100%;
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 2s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
}

@keyframes gradient {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>