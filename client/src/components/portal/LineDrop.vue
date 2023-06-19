<template>
    <div style="width: 100%; height: 100%; position: absolute; overflow: hidden;">
        <div class="line" style="left: 20%; --duration: 2s; --delay: .5s;"></div>
        <div class="line" style="left: 40%; --duration: 3s; --delay: .3s;"></div>
        <div class="line" style="left: 60%; --duration: 2.5s; --delay: .8s;"></div>
        <div class="line" style="left: 80%; --duration: 3.5s; --delay: .2s;"></div>
    </div>
</template>

<style lang="scss" scoped>
.line {
    width: 2px;
    height: 100%;
    border: 1px solid #eeeeee23;
    position: absolute;
    z-index: 1;
}

.line:before {
    content: '';
    position: absolute;
    width: 2px;
    height: 0;
    background-color: var(--secondary-purple);
    top: 0;
    left: 0;
    margin-left: -1px;
    animation: fill var(--duration) linear infinite;
    animation-delay: var(--delay);
}

@keyframes fill {
    0% {
        top: 0%;
        height: 100px;
    }

    100% {
        height: 100px;
        top: 100%;
    }
}
</style>