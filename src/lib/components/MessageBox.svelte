<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<form
  use:enhance
  method="POST"
  class="flex gap-2"
>
  <input
    type="text"
    name="newMessage"
    autocomplete="off"
    placeholder="Type a message"
    class="input"
  />

  <button
    type="submit"
    class="btn-icon variant-filled-primary"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width="24"
      height="24"
    >
      <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
    </svg>
  </button>
</form>
