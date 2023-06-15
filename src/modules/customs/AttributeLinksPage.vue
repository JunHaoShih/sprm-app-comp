<template>
  <div class="main-panel">
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
                v-for="objType in objectTypes"
                :key="objType.id"
                clickable
                v-ripple
                :active="defaultObjectType.id === objType.id"
                @click="defaultObjectType = objType"
                active-class="bg-secondary text-white"
              >
                <q-item-section avatar>
                  <q-avatar class="avatar-color" text-color="white">{{ objType.name[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                  {{ objType.number }} {{ objType.name }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </template>

      <template v-slot:after>
        <AttributeLinkPanel :objectTypeId="defaultObjectType.id" />
      </template>

    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import AttributeLinkPanel from './components/AttributeLinkPanel.vue';
import { ObjectType } from '../objectTypes/models/ObjectType';
import { objectTypeService } from '../objectTypes/ObjectTypeService';

const splitterModel = ref(350);

const objectTypes = ref<ObjectType[]>([]);

const defaultObjectType = ref<ObjectType>({} as ObjectType);

onBeforeMount(async () => {
  const objTypes = await objectTypeService.getAll();
  if (objTypes) {
    objectTypes.value = objTypes;
    const firstObjType = objectTypes.value[0];
    defaultObjectType.value = firstObjType;
  }
});
</script>

<style lang="sass">
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 100px)

.scroll-max
  height: calc(100vh - 135px)

.avatar-color
  background: #FF9933
</style>
