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
          :label="$t('actions.add')"
          @click="prompt=true"
          class="action-btn"
        />
        <q-btn
          :label="$t('actions.delete')"
          class="action-btn"
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
                <div>
                  <q-icon name="edit" color="primary"/>
                  {{ $t('actions.edit') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <div>
                  <q-icon name="delete" color="red"/>
                  {{ $t('actions.delete') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onHistoryClicked(props.part)"
              >
                <div>
                  <q-icon name="history" color="primary"/>
                  {{ $t('iterable.history') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onRoutingClicked(props.part)"
              >
                <div>
                  <q-icon name="route" color="primary"/>
                  {{ $t('parts.routing') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="!props.part.checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onCheckOutClicked(props.part)"
              >
                <div>
                  <q-icon name="south_east" color="red"/>
                  {{ $t('actions.checkout') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="props.part.checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onCheckInClicked(props.part)"
              >
                <div>
                  <q-icon name="south_east" color="secondary"/>
                  {{ $t('actions.checkin') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="props.part.checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onDiscardClicked(props.part)"
              >
                <div>
                  <q-icon name="backspace" color="red"/>
                  {{ $t('actions.discard') }}
                </div>
              </q-item-section>
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PartDialog from './components/PartDialog.vue';
import PartsSearchPanel from './components/PartsSearchPanel.vue';
import { usePartsStore } from './stores/PartsStore';
import { Part } from './models/Part';
import 'src/extensions/date.extensions';
import { partService } from './services/PartService';

const $q = useQuasar();

const i18n = useI18n();

const route = useRoute();

const router = useRouter();

const partsStore = usePartsStore();

const pattern = ref('');

const prompt = ref(false);

const selected = ref<Part[]>([]);

function onInfoClicked(part: Part): void {
  router.push(`parts/version/${part.version.id}/info`);
}

function onHistoryClicked(part: Part) {
  router.push(`parts/${part.id}/history`);
}

async function onCheckInClicked(part: Part): Promise<void> {
  const checkinPart = await partService.checkIn(part.id);
  if (checkinPart) {
    partsStore.updatePart(checkinPart);
    $q.notify({
      message: i18n.t('actions.checkins.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
  }
}

async function onCheckOutClicked(part: Part): Promise<Part | null> {
  const checkoutPart = await partService.checkOut(part.id);
  if (checkoutPart) {
    partsStore.updatePart(checkoutPart);
    $q.notify({
      message: i18n.t('actions.checkouts.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
    return checkoutPart;
  }
  return null;
}

function onRoutingClicked(part: Part): void {
  router.push(`parts/${part.id}/routing`);
}

function onDiscardClicked(part: Part): void {
  if (part.draftId === part.version.id) {
    $q.notify({
      message: i18n.t('actions.discards.cannotDiscardFirstVersion'),
      color: 'red',
      icon: 'error',
    });
    return;
  }
  $q.dialog({
    dark: true,
    title: i18n.t('actions.discards.confirm'),
    message: i18n.t('actions.discards.dataLossWarning'),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const discardPart = await partService.discard(part.id);
    if (discardPart) {
      partsStore.updatePart(discardPart);
      $q.notify({
        message: i18n.t('actions.discards.success'),
        color: 'secondary',
        icon: 'check_circle',
      });
    }
  });
}

function onEditClicked(part: Part): void {
  if (!part.checkout) {
    $q.dialog({
      dark: true,
      title: i18n.t('actions.checkout'),
      message: i18n.t('parts.wantToCheckOut'),
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      const checkoutPart = await onCheckOutClicked(part);
      if (checkoutPart) {
        router.push(`parts/version/edit/${checkoutPart.draftId}/info`);
      }
    });
  } else {
    router.push(`parts/version/edit/${part.draftId}/info`);
  }
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
