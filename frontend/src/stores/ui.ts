import { defineStore } from 'pinia'
import { ref } from 'vue'

type ToastType = 'success' | 'error'

export const useUiStore = defineStore('ui', () => {

    const show = ref(false)

    const message = ref('')

    const type = ref<ToastType>('success')

    const showToast = (
        toastMessage: string,
        toastType: ToastType = 'success'
    ) => {

        message.value = toastMessage

        type.value = toastType

        show.value = true

        setTimeout(() => {
            show.value = false
        }, 3000)
    }

    return {
        show,
        message,
        type,
        showToast
    }
})
