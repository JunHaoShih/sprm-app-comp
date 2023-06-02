<template>
  <div class="q-pa-sm">
    <!-- product files table -->
    <PartsSearchPanel
      v-model="pattern"
      :readonly="true"
      v-model:selected="selected"
      selection="multiple"
      class="main-panel"
      table-class="outer-max"
      @on-search="onSearch"
    >
      <template v-slot:table-top>
        <q-btn
          push
          color="primary"
          :label="$t('actions.add')"
          @click="prompt=true"
        />
        <q-btn
          push
          color="primary"
          :label="$t('actions.delete')"
        />
      </template>
      <template v-slot:row-actions="props">
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="edit"
          size="12px"
          @click="onEditClicked(props.part)"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="delete"
          size="12px"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="info"
          size="12px"
          @click="onInfoClicked(props.part)"
        />
      </template>
      <template v-slot:cell-after="props">
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onEditClicked(props.part)"
              >
                {{ $t('actions.edit') }}
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('actions.delete') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('parts.routing') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </PartsSearchPanel>
    <PartDialog v-model="prompt" @onPartCreated="onPartCreated"></PartDialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  LocationQueryValue, onBeforeRouteUpdate, useRoute, useRouter,
} from 'vue-router';
import PartDialog from './components/PartDialog.vue';
import PartsSearchPanel from './components/PartsSearchPanel.vue';
import { usePartsStore } from './stores/PartsStore';
import { Part } from './models/Part';
import 'src/extensions/date.extensions';

const route = useRoute();

const router = useRouter();

const partsStore = usePartsStore();

const pattern = ref('');

const prompt = ref(false);

const selected = ref<Part[]>([]);

function onInfoClicked(part: Part): void {
  router.push(`parts/version/${part.version.id}/info`);
}

function onEditClicked(part: Part): void {
  if (!part.checkout) {
    // TODO show dialog to checkout
  }
  router.push(`parts/version/edit/${part.version.id}/info`);
}

function onPartCreated(newPart: Part) {
  partsStore.unshiftPart(newPart);
}

async function updatePattern(queryValue: LocationQueryValue | LocationQueryValue[]) {
  const newPattern = Array.isArray(queryValue)
    ? queryValue[0] === null || queryValue[0] === undefined ? '' : queryValue[0]
    : queryValue === null || queryValue === undefined ? '' : queryValue;
  pattern.value = newPattern;
}

function onSearch(searchPattern: string) {
  pattern.value = searchPattern;
  router.push({
    path: '/parts',
    query: { pattern: searchPattern },
  });
}

onBeforeRouteUpdate(async (to) => {
  await updatePattern(to.query.pattern);
});

onBeforeMount(async () => {
  await updatePattern(route.query.pattern);
});
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 125px)
</style>
