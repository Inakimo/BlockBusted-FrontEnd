export function toast(message, type = 'error', subtitle = null) {
  window.dispatchEvent(new CustomEvent('bb-toast', { detail: { message, type, subtitle } }))
}
