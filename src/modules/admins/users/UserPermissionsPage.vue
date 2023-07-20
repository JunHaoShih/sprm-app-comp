<template>
  <div class="q-pa-sm">
    <q-table
      dense
      :rows="updatePermissionDtos"
      :columns="defaultColumns"
      row-key="objectType"
      :rows-per-page-options="[0]"
      :loading="loading"
      class="main-panel sticky-header-table"
      table-class="table-max"
    >
      <template v-slot:top>
        <q-btn
          icon="save"
          :label="$t('actions.update')"
          class="action-btn"
          :loading="saving"
          @click="savePermissions"
        >
          <template v-slot:loading>
            <q-spinner color="red-7" />
          </template>
        </q-btn>
      </template>
      <!-- editable table can only be achieved by body scoped slot-->
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- display object type name -->
          <q-td key="objectType" :props="props">
            {{ $t(objectTypeNames[props.row.objectType as SprmObjectType]) }}
          </q-td>
          <!-- display create permission switch -->
          <q-td key="createPermitted" :props="props">
            <q-toggle size="sm" v-model="props.row.createPermitted"/>
          </q-td>
          <!-- display read permission switch -->
          <q-td key="readPermitted" :props="props">
            <q-toggle size="sm" v-model="props.row.readPermitted"/>
          </q-td>
          <!-- display update permission switch -->
          <q-td key="updatePermitted" :props="props">
            <q-toggle size="sm" v-model="props.row.updatePermitted"/>
          </q-td>
          <!-- display update permission switch -->
          <q-td key="deletePermitted" :props="props">
            <q-toggle size="sm" v-model="props.row.deletePermitted"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="red-7" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { objectTypeService } from 'src/modules/objectTypes/ObjectTypeService';
import { ObjectType, SprmObjectType, objectTypeI18n } from 'src/modules/objectTypes/models/ObjectType';
import { UpdatePermissionDto } from 'src/modules/permissions/dtos/UpdatePermissionDto';
import { Permission } from 'src/modules/permissions/models/Permission';
import { permissionService } from 'src/modules/permissions/services/PermissionService';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteUpdate } from 'vue-router';

const i18n = useI18n();

const $q = useQuasar();

const loading = ref(false);

const saving = ref(false);

const permissions = ref<Permission[]>([]);

const updatePermissionDtos = ref<UpdatePermissionDto[]>([]);

const permissibles = ref<ObjectType[]>([]);

const objectTypeNames = objectTypeI18n;

const props = defineProps<{
  id: number,
}>();

const defaultColumns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'objectType', required: true, label: i18n.t('permissions.option'), field: 'objectType', align: 'left', sortable: true,
    },
    {
      name: 'createPermitted', required: true, label: i18n.t('cruds.create'), field: 'createPermitted', align: 'left', sortable: true,
    },
    {
      name: 'readPermitted', required: true, label: i18n.t('cruds.read'), field: 'readPermitted', align: 'center', sortable: true,
    },
    {
      name: 'updatePermitted', required: true, label: i18n.t('cruds.update'), field: 'updatePermitted', align: 'center', sortable: true,
    },
    {
      name: 'deletePermitted', required: true, label: i18n.t('cruds.delete'), field: 'deletePermitted', align: 'center', sortable: true,
    },
  ],
);

async function savePermissions() {
  saving.value = true;
  const code = await permissionService.updateByUserId(props.id, updatePermissionDtos.value);
  if (code === 0) {
    $q.notify({
      message: i18n.t('actions.updates.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
  }
  saving.value = false;
}

async function getPermissions(userId: number) {
  const targetPermissions = await permissionService.getByUserId(userId);
  if (targetPermissions) {
    permissions.value = targetPermissions;
  }
}

async function getPermissibles() {
  const targetPermissibles = await objectTypeService.getPermissibles();
  if (targetPermissibles) {
    permissibles.value = targetPermissibles;
  }
}

function refreshData() {
  updatePermissionDtos.value.length = 0;
  const dtos = permissibles.value.map((objType): UpdatePermissionDto => {
    const permission = permissions.value.find((p) => p.objectType === objType.id);
    return {
      objectType: objType.id as SprmObjectType,
      createPermitted: !permission ? false : permission.createPermitted,
      readPermitted: !permission ? false : permission.readPermitted,
      updatePermitted: !permission ? false : permission.updatePermitted,
      deletePermitted: !permission ? false : permission.deletePermitted,
    };
  });
  updatePermissionDtos.value = dtos;
}

onBeforeRouteUpdate(async (to) => {
  loading.value = true;
  await getPermissions(Number(to.params.id));
  refreshData();
  loading.value = false;
});

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([
    getPermissions(props.id),
    getPermissibles(),
  ]);
  refreshData();
  loading.value = false;
});
</script>

<style lang="sass">
.table-max
  height: calc(100vh - 310px)
</style>
