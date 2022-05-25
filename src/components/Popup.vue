<script setup lang="ts">
import { useMainStore } from '../stores/mainStore'

import { ref } from "vue"

const mainStore = useMainStore()

const show = ref(true)

const mode = ref('')

</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <slot name="header">Choose theme</slot>
                </div>

                <div class="modal-body">
                    <input type="radio" name="body" value="light" v-model="mode"> Light <br>
                </div>

                <div class="modal-body">
                    <input type="radio" name="body" value="dark" v-model="mode"> Dark <br>
                </div>

                <div class="modal-body">
                    <input type="radio" name="body" value="auto" v-model="mode"> Auto <br>
                </div>

                <div class="modal-footer">
                    <div class="modal-default-button" @click="show=false">
                        CANCEL
                    </div>
                    <div class="modal-default-button" @click="show=false;mainStore.changePreferColorSchema(mode)">
                        OK
                    </div>
                </div>
            </div>
        </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.706);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(100, 100, 100, 0.33);
    transition: all 0.3s ease;
}

.modal-header {
    margin-top: 0;
}

.modal-footer {
    padding: 10px;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    background-color: #007AFF;
    padding: 5px 10px 4px 10px;
    color: white;
    cursor: pointer;
    height: 20px;
    width: fit;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 10px;
    font-weight: 400; 
}

</style>