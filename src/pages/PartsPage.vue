<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('parts.title')" icon="settings" to="/parts" />
    </q-breadcrumbs>
    <q-separator color="black" class="q-my-sm"/>
    <!-- product files table -->
    <PartsSearchPanel
      v-model="pattern"
      :readonly="true"
      v-model:selected="selected"
      selection="multiple"
      class="main-panel sticky-header-table"
      table-class="outer-max"
      @on-search="onSearch"
    >
      <template v-slot:table-top>
        <q-btn
          :label="$t('actions.add')"
          @click="prompt=true"
          class="action-btn"
        />
      </template>
      <template v-slot:row-actions="props">
        <q-btn
          v-if="currentUserStore.hasPermission(partType, 'update')"
          dense
          round
          flat
          color="grey"
          icon="edit"
          size="sm"
          @click="onEditClicked(props.part)"
        />
        <q-btn
          v-if="currentUserStore.hasPermission(partType, 'delete')"
          dense
          round
          flat
          color="grey"
          icon="delete"
          size="sm"
          @click="onDeleteClicked(props.part)"
        />
        <q-btn
          v-if="currentUserStore.hasPermission(partType, 'read')"
          dense
          round
          flat
          color="grey"
          icon="info"
          size="sm"
          :to="`/parts/version/${props.part.version.id}/info`"
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
                @click="onBomClicked(props.part)"
              >
                <div>
                  <q-icon name="list" color="primary"/>
                  {{ $t('parts.bom') }}
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
import PartDialog from '../modules/parts/components/PartDialog.vue';
import PartsSearchPanel from '../modules/parts/components/PartsSearchPanel.vue';
import { usePartsStore } from '../modules/parts/stores/PartsStore';
import { Part } from '../modules/parts/models/Part';
import 'src/extensions/date.extensions';
import { partService } from '../modules/parts/services/PartService';
import { useCurrentUserStore } from '../modules/appUsers/stores/CurrentUserStore';
import { SprmObjectType } from '../modules/objectTypes/models/ObjectType';

const $q = useQuasar();

const i18n = useI18n();

const route = useRoute();

const router = useRouter();

const partsStore = usePartsStore();

const currentUserStore = useCurrentUserStore();

const pattern = ref('');

const prompt = ref(false);

const selected = ref<Part[]>([]);

const partType = SprmObjectType.PartVersion;

function onHistoryClicked(part: Part) {
  router.push(`/parts/${part.id}/history`);
}

function onBomClicked(part: Part) {
  router.push(`/parts/version/${part.version.id}/usages`);
}

async function onCheckInClicked(part: Part): Promise<void> {
  const checkinPart = await partService.checkIn(part.id);
  if (checkinPart) {
    partsStore.updatePart(checkinPart);
    $q.notify({
      type: 'success',
      message: i18n.t('actions.checkins.success'),
    });
  }
}

async function onCheckOutClicked(part: Part): Promise<Part | null> {
  const checkoutPart = await partService.checkOut(part.id);
  if (checkoutPart) {
    partsStore.updatePart(checkoutPart);
    $q.notify({
      type: 'success',
      message: i18n.t('actions.checkouts.success'),
    });
    return checkoutPart;
  }
  return null;
}

function onRoutingClicked(part: Part): void {
  router.push(`/parts/${part.id}/routing`);
}

function onDiscardClicked(part: Part): void {
  if (part.draftId === part.version.id) {
    $q.notify({
      type: 'error',
      message: i18n.t('actions.discards.cannotDiscardFirstVersion'),
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
        type: 'success',
        message: i18n.t('actions.discards.success'),
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
        router.push(`/parts/version/edit/${checkoutPart.draftId}/info`);
      }
    });
  } else {
    router.push(`/parts/version/edit/${part.draftId}/info`);
  }
}

function onDeleteClicked(part: Part): void {
  $q.dialog({
    title: 'Confirm',
    message: `${i18n.t('actions.deletes.confirm')} ${part.number}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const success = await partService.remove(part.id);
    if (success) {
      $q.notify({
        type: 'success',
        message: `${part.number}: ${i18n.t('actions.deletes.success')}`,
      });
      partsStore.removePart(part);
    }
  });
}

function onPartCreated(newPart: Part) {
  partsStore.unshiftPart(newPart);
}

async function updatePattern(queryValue: LocationQueryValue | LocationQueryValue[]) {
  const newPattern = queryValue as string;
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
  height: calc(100vh - 155px)
</style>
