<template>
  <div v-if="!initializing"
    class="q-pa-sm main-panel"
  >
    <q-card style="min-width: 400px">
      <q-card-section>
        <q-scroll-area class="outer-max" visible>
          <div>
            <q-expansion-item
              v-model="infoExpanded"
              icon="article"
              :label="$t('info')"
              header-class="info-card-header"
              class="info-card-body"
              style="border-radius: 10px"
            >
            <div class="q-pa-sm">
              <ValidationInput
                v-model="user.username"
                :label="$t('users.username')"
                :readonly="true"
              />
              <ValidationInput
                v-model="user.fullName"
                :label="$t('users.fullName')"
                :readonly="true"
              />
              <!-- is admin -->
              <div class="row">
                <q-checkbox
                  left-label
                  class="q-ml-sm"
                  v-model="user.isAdmin"
                  :disable="true"
                  :label="$t('users.isAdmin')"
                />
              </div>
              <div class="column">
                <q-input
                  v-model="user.remarks"
                  :label="$t('remarks')"
                  filled
                  type="textarea"
                  :readonly="true"
                />
              </div>
            </div>
            </q-expansion-item>
            <q-separator class="q-mb-md"/>

            <CustomAttributesInputPanel
              v-model="user.customValues"
              :sprmObjectType="sprmObjectType"
              :readonly="true"
            ></CustomAttributesInputPanel>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/modules/appUsers/stores/AppUserStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { computed, ref } from 'vue';

const userStore = useUserStore();

const user = computed(
  () => userStore.appUser,
);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.AppUser;
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 250px)
</style>
