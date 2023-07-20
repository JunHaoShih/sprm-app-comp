<template>
  <div>
    <q-banner
      class="info-banner"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <q-icon name="person" size="24px" class="q-mt-xs q-mr-sm"/>
        <div>{{ appUser.username }}</div>
        <div
          class="q-ml-sm"
        >
          <q-badge color="primary">
            {{ appUser.fullName }}
          </q-badge>
        </div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { AppUser } from '../models/AppUser';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  appUser: AppUser,
}>();
</script>
