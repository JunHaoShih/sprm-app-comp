<template>
  <div class="main-panel">
    <div class="row q-px-md q-gutter-xs">
      <q-btn
        class="action-btn"
        :label="$t('actions.add')"
        @click="onAddClicked"
      />
      <q-btn
        class="action-btn"
        :label="$t('actions.delete')"
        @click="onDeleteClicked"
      />
      <q-space/>
      <q-input
        dense
        v-model="patternInput"
        :label="$t('actions.search')"
        v-on:keyup.enter="onSearch"
      ></q-input>
    </div>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-scroll-area
            visible
            class="scroll-max"
          >
            <q-list bordered padding class="rounded-borders text-black">
              <q-item
                v-for="routing in routings"
                :key="routing.id"
                clickable
                v-ripple
                :active="defaultRouting.id === routing.id"
                @click="defaultRouting = routing"
                active-class="bg-secondary text-white"
              >
                <q-item-section avatar>
                  <q-avatar
                    class="avatar-color"
                    text-color="white"
                  >
                    {{ routing.name[0] }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  {{ routing.name }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </template>

      <template v-slot:after>
        <div>Test</div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { Routing } from './models/Routing';

const routings = ref<Routing[]>([]);

const defaultRouting = ref<Routing>({} as Routing);

const splitterModel = ref(350);

const pattern = ref('');

const patternInput = ref('');

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

function onSearch(): void {
  pattern.value = patternInput.value;
}

function onAddClicked(): void {
  // TODO add routing
}

function onDeleteClicked(): void {
  // TODO delete routing
}

async function initialize() {
  for (let i = 0; i < 100; i += 1) {
    routings.value.push({
      id: i,
      createUser: '123',
      createDate: new Date(),
      updateUser: '123',
      updateDate: new Date(),
      remarks: '',
      partId: 1,
      name: `Routing ${i}`,
      checkout: true,
    });
  }
}

watch(() => props.id, async () => {
  await initialize();
});

onBeforeMount(async () => {
  await initialize();
});
</script>

<style lang="sass">
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 230px)

.scroll-max
  height: calc(100vh - 265px)

.avatar-color
  background: #FF9933
</style>
