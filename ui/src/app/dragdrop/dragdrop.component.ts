import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OlMapComponent } from '../ol.map/ol.map.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.css'],
})
export class DragdropComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {}

  exportStatus = 'none'; //success,fail
  /**cluster corrections */
  loadingLoader = false;
  outliers_data = [];
  clusterCorrectionForm: FormGroup;
  isShowTerminal = false;
  mainApi = environment.api + '/api/';
  currentDraggedNewModel: any = null;
  currentMode = 'create'; //edit
  currentEditIndex = -1;
  currentExecuteNodeIndex = -1;
  mainNodes: any = [
    {
      name: 'Cluster Boundary',
      key: 'secondary_clusterbndry',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_clusterbndry',
      },
    },
    {
      name: 'Fully UG Cluster Grouping',
      key: 'ug_page',
      result: {},
      formData: null,
      form: {
        endpointApi: 'ug_page',
      },
    },
    {
      name: 'Nodeplacement',
      key: 'hybrid_nodeplacement',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_hybrid_np',
      },
    },
    {
      name: 'Node Boundary ',
      key: 'node_boundary',
      result: {},
      formData: null,
      form: {
        endpointApi: 'nb_page',
      },
    },
    {
      name: 'PN Nodeplacement',
      key: 'secondary_pn_np',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_pn_np',
      },
    },
    {
      name: 'Cabinet Placement',
      key: 'secondary_cp',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_cp',
      },
    },
    {
      name: 'Cluster Corrections',
      key: 'cluster_corrections',
      result: {},
      formData: null,
      form: {
        endpointApi: 'update_db',
        renderData: '',
        loadRenderData: function () {
          this.httpClient
            .get(
              this.mainApi +
                'load_data?username=' +
                localStorage.getItem('username')
            )
            .subscribe((res) => {
              let outliers_data = [];
              for (var i = 0; i < res['cluster_id'].length; i++) {
                console.log(res['cluster_id'][i]);
                outliers_data.push({
                  cluster_id: res['cluster_id'][i],
                  sum_pon_homes: res['sum_pon_homes'][i],
                });
              }
            });
        },
      },
    },
    {
      name: 'Add address creation',
      key: 'secondary_add_page',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_add_page',
      },
    },
    /*{
      name: 'Distribution network',
      key: 'secondary_dis_page',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_dis_page',
      },
    },
    {
      name: 'Brownfield cluster grouping',
      key: 'bf_page',
      result: {},
      formData: null,
      form: {
        endpointApi: 'bf_page',
      },
    },
    {
      name: 'Core Network',
      key: 'secondary_core_page',
      result: {},
      formData: null,
      form: {
        endpointApi: 'secondary_core_page',
      },
    },
    {
      name: 'Secondary Nodeboundary',
      key: 'secondary_nodeboundary',
      result: {},
      formData: null,
      form: {
        endpointApi: 'snboundary_page',
      },
    },*/
    {
      name: 'Trenching',
      key: 'trenching',
      result: {},
      formData: null,
      form: {
        endpointApi: 'trenching',
      },
    },
    {
      name: 'Integrated infrastructure',
      key: 'integrated_infrastructure',
      result: {},
      formData: null,
      form: {
        endpointApi: 'integrated_infrastructure',
      },
    },
    {
      name: 'Data cleanup',
      key: 'data_cleanup',
      result: {},
      formData: null,
      form: {
        endpointApi: 'data_cleanup',
      },
    },
    {
      name: 'Address association',
      key: 'address_association',
      result: {},
      formData: null,
      form: {
        endpointApi: 'address_association',
      },
    },
    {
      name: 'Address creation',
      key: 'address_creation',
      result: {},
      formData: null,
      form: {
        endpointApi: 'address_creation',
      },
    },
  ];
  draggedNodes = [];
  lines = [];
  @ViewChild('mapComponent') mapComponent: OlMapComponent;

  terminalDetails = [];

  dropNewModel(event, node_) {
    if (this.activatedRoute.snapshot.params['type'] == 'google') {
      // if (this.draggedNodes.length == 0 && node_.key != 'SHAPEFILES_PATH') {
      //   // alert(
      //   //   'Warning!!! First model should be one of the following: SHAPEFILES_PATH!'
      //   // );
      //   return;
      // }
    } else {
      if (
        this.draggedNodes.length == 0 &&
        node_.key != 'secondary_clusterbndry' &&
        node_.key != 'ug_page' &&
        node_.key != 'secondary_pn_np'
      ) {
        alert(
          'Warning!!! First model should be one of the following: Cluster Boundary, Fully UG Cluster Grouping, PN Nodeplacement!'
        );
        return;
      }
      if (this.draggedNodes.length == 0 && node_.key == 'cluster_corrections') {
        alert(
          'Warning!!! Before cluster corrections model should be selected cluster grouping model!'
        );
        return;
      }
    }

    let copiedNewNode = JSON.parse(JSON.stringify(node_));
    let uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    copiedNewNode['modelName'] = node_.key + uniqueId;
    this.currentDraggedNewModel = copiedNewNode;
    this.currentMode = 'create';
    if (this.currentDraggedNewModel.form.showInputsFormOnDrag) {
      this.showDialog();
    } else {
      this.draggedNodes.push(this.currentDraggedNewModel);
      this.currentDraggedNewModel = null;
    }
  }

  replaceDraggedModel(event, draggedNode) {
    draggedNode.dragPosition.x = event.dropPoint.x;
    draggedNode.dragPosition.y = event.dropPoint.y;
    this.refreshLines();
  }

  removeItem(ind_, node) {
    if (
      this.draggedNodes.length > 0 &&
      this.draggedNodes[0].key != 'secondary_clusterbndry' &&
      this.draggedNodes[0].key != 'ug_page'
    ) {
      alert(
        'Warning!!! First model should be one of the following: Cluster Boundary, Fully UG Cluster Grouping!'
      );
      return;
    }
    this.draggedNodes.splice(ind_, 0);
  }

  removeDraggedModel(ind_, node) {
    this.mapComponent.removeLayerByModelName(this.draggedNodes[ind_].modelName);
    this.draggedNodes.splice(ind_, 1);
    this.refreshLines();
  }
  editDraggedModelInput(ind_, node) {
    this.currentEditIndex = ind_;
    this.currentDraggedNewModel = node;
    this.currentMode = 'edit';
    this.showDialog();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['type'] == 'google') {
      this.mainNodes = [
        {
          name: 'SHAPEFILES PATH',
          key: 'SHAPEFILES_PATH',
          result: {},
          formData: null,
          form: {
            endpointApi: 'shape_file_page',
            showInputsFormOnDrag: true,
            inputFiles: [
              {
                label: 'demand files',
                name: 'demand_files',
                files: [],
              },
              {
                label: 'duct files',
                name: 'duct_files',
                files: [],
              },
              {
                label: 'landboundary files',
                name: 'landboundary_files',
                files: [],
              },
              {
                label: 'piastruc files',
                name: 'piastruc_files',
                files: [],
              },
              {
                label: 'streetcenterline files',
                name: 'streetcenterline_files',
                files: [],
              },
              {
                label: 'gaistdata files',
                name: 'gaistdata_files',
                files: [],
              },
              {
                label: 'topographiclines files',
                name: 'topographiclines_files',
                files: [],
              },
              {
                label: 'cartograpgictext_file',
                name: 'cartograpgictext_file',
                files: [],
              },
              {
                label: 'pnboundary_files',
                name: 'pnboundary_files',
                files: [],
              },
              {
                label: 'primarynodes_files',
                name: 'primarynodes_files',
                files: [],
              },
              {
                label: 'FAC-FHUB',
                name: 'FAC-FHUB',
                files: [],
              },
              {
                label: 'Feeder Ring Cables',
                name: 'Feeder Ring Cables',
                files: [],
              },
              {
                label: 'IN_CustomerPremises',
                name: 'IN_CustomerPremises',
                files: [],
              },
              {
                label: 'IN_ForcedPrimDistributionClusters',
                name: 'IN_ForcedPrimDistributionClusters',
                files: [],
              },
              {
                label: 'OUT_BackBonePoints',
                name: 'OUT_BackBonePoints',
                files: [],
              },
              {
                label: 'TopographicArea',
                name: 'TopographicArea',
                files: [],
              },
            ],
          },
        },
        {
          name: 'Google api fetch',
          key: 'google_api_fetch',
          result: {},
          formData: null,
          form: {
            endpointApi: 'upload_streetcenterline',
            showInputsFormOnDrag: true,
            inputFiles: [
              {
                label: 'Street center line files',
                name: 'streetcenterline_files',
                files: [],
              },
            ],
          },
        },
        {
          name: 'Pn bondry',
          key: 'pn_bondry',
          result: {},
          formData: null,
          form: {
            endpointApi: 'pn_bondry',
            showInputsFormOnDrag: true,
            inputFiles: [
              {
                label: 'Pnboundary files',
                name: 'pnboundary_files',
                files: [],
              },
            ],
            inputs: [
              {
                name: 'city_name',
                value: null,
                label: 'Pn Number',
                placeholder: 'Enter Pn Number'
              },
            ],
          },
        },
      ];
    }

    let nodesWithProps = [];
    this.mainNodes.forEach((element: any) => {
      nodesWithProps.push({
        name: element.name,
        key: element.key,
        result: null,
        formData: null,
        form: element.form,
        isRunning: false,
        isCompleted: false,
        hasError: false,
        dragPosition: {
          x: 310,
          y: null,
        },
      });
    });
    this.mainNodes = nodesWithProps;

    this.clusterCorrectionForm = this.formBuilder.group({
      input_cluster_id: [''],
      output_cluster_id: [''],
      gis_tool_id: [''],
    });

    if (window.location.port == '9090') {
      this.mainApi =
        window.location.protocol + '//' + window.location.hostname + ':5000/';
    }
  }

  showTerminal() {
    this.isShowTerminal = true;
  }

  currentModelFilesDropped(event, fileType) {
    for (
      let j = 0;
      j < this.currentDraggedNewModel.form.inputFiles.length;
      j++
    ) {
      if (this.currentDraggedNewModel.form.inputFiles[j].name == fileType) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.currentDraggedNewModel.form.inputFiles[j].files.push({
            file: event.target.files[i],
          });
        }
      }
    }
  }

  ///-----------dialog modal -------------//

  public visible = false;
  public visibleAnimate = false;

  public showDialog(): void {
    this.visible = true;
    setTimeout(() => (this.visibleAnimate = true), 100);
  }

  public hideDialog(): void {
    this.visibleAnimate = false;
    if (this.currentMode == 'create') {
      this.draggedNodes.push(this.currentDraggedNewModel);
    } else {
      this.draggedNodes[this.currentEditIndex] = this.currentDraggedNewModel;
    }

    this.currentDraggedNewModel = null;
    this.currentMode = '';

    setTimeout(() => (this.visible = false), 300);
    this.refreshLines();
  }

  public hideDialogWithCancel(): void {
    this.visibleAnimate = false;
    this.currentMode = '';
    this.currentDraggedNewModel = null;
    setTimeout(() => (this.visible = false), 300);
  }

  refreshLines() {
    this.lines = [];
    if (this.draggedNodes.length > 1) {
      setTimeout(() => {
        for (let i = 1; i < this.draggedNodes.length; i++) {
          const startElement = document.querySelector('#start_' + (i - 1));
          const endElement = document.querySelector('#start_' + i);
          const startRect = startElement.getBoundingClientRect();
          const endRect = endElement.getBoundingClientRect();

          const startX = startRect.right - 25;
          const startY = startRect.top + 20;

          const endX = endRect.left - 18;
          const endY = endRect.top + 20;
          this.lines.push({ x1: startX, y1: startY, x2: endX, y2: endY });
        }
      });
    }
  }

  start() {
    for (let i = 0; i < this.draggedNodes.length; i++) {
      let endpointUrl = '';
      if (this.draggedNodes[i].key == 'node_placements')
        for (
          let j = 0;
          j < this.draggedNodes[i].form.inputSelects.length;
          j++
        ) {
          if (
            this.draggedNodes[i].form.inputSelects[j].name == 'cluster_type'
          ) {
            endpointUrl =
              this.draggedNodes[i].form.inputSelects[j].value == '1'
                ? 'aerial_page'
                : 'ug_page';
            if (this.draggedNodes[i].key == 'node_placements') {
              endpointUrl =
                this.draggedNodes[i].form.inputSelects[j].value == '1'
                  ? 'np_page'
                  : 'np_ug_page';
            }
            break;
          }
        }
      else {
        endpointUrl = this.draggedNodes[i].form.endpointApi;
      }
      endpointUrl = `${this.mainApi}${endpointUrl}`;
      this.draggedNodes[i].form.endpointApi = endpointUrl;

      const formData = new FormData();
      formData.append('username', localStorage.getItem('username'));
      if (this.draggedNodes[i].form.inputs) {
        for (let j = 0; j < this.draggedNodes[i].form.inputs.length; j++) {
          formData.append(
            this.draggedNodes[i].form.inputs[j].name,
            this.draggedNodes[i].form.inputs[j].value
          );
        }
      }
      /*if (this.draggedNodes[i].form.inputSelects) {
        for (
          let j = 0;
          j < this.draggedNodes[i].form.inputSelects.length;
          j++
        ) {
          formData.append(
            this.draggedNodes[i].form.inputSelects[j].name,
            this.draggedNodes[i].form.inputSelects[j].value
          );
        }
      }*/
      if (this.draggedNodes[i].form.inputFiles) {
        for (let j = 0; j < this.draggedNodes[i].form.inputFiles.length; j++) {
          let inputFile = this.draggedNodes[i].form.inputFiles[j];
          for (let k = 0; k < inputFile.files.length; k++) {
            formData.append(inputFile.name, inputFile.files[k].file);
          }
        }
      }
      this.draggedNodes[i].formData = formData;
    }
    if (this.draggedNodes.length > 0) {
      this.draggedNodes[0].isRunning = true;
      this.terminalDetails.push(
        this.draggedNodes[0].name + ' run started .....'
      );
      this.httpClient
        .post(
          this.draggedNodes[0].form.endpointApi,
          this.draggedNodes[0].formData
        )
        .subscribe(
          (res) => {
            this.draggedNodes[0].isRunning = false;
            this.draggedNodes[0].isCompleted = true;
            this.draggedNodes[0].result = res;
            this.terminalDetails.push(
              this.draggedNodes[0].name + ' run completed successfully'
            );
            if (this.draggedNodes[0].key == 'google_api_fetch') {
              const formData2 = new FormData();
              formData2.append('city_name', localStorage.getItem('username'));
              this.httpClient
                .post('/api/google_api_fetch', formData2)
                .subscribe(
                  (res2) => {
                    alert('google_api_fetch success');
                  },
                  (err2) => {
                    alert('google_api_fetch error');
                  }
                );
            }
          },
          (err) => {
            console.error(err);
            this.draggedNodes[0].isCompleted = true;
            this.draggedNodes[0].hasError = true;
            this.terminalDetails.push(
              this.draggedNodes[0].name + ' run completed with error'
            );
          },
          () => {
            if (this.draggedNodes.length > 1) {
              if (this.draggedNodes[1].key == 'cluster_corrections') {
                //TODO:
                this.loadClusterCorrections();

                setTimeout(() => {
                  window.scrollTo(0, document.body.scrollHeight);
                }, 2000);
                this.draggedNodes[1].isRunning = true;
                this.currentExecuteNodeIndex = 1;
              } else if (this.draggedNodes[1].key == 'distribution_network') {
                setTimeout(() => {
                  window.scrollTo(0, document.body.scrollHeight);
                }, 2000);
                this.draggedNodes[1].isRunning = true;
                this.currentExecuteNodeIndex = 1;
                this.loopPostRequestThroughDraggedModels(1);
              } else {
                this.loopPostRequestThroughDraggedModels(1);
              }
            }
            this.showUpdateMap();
          }
        );
    }
  }

  loopPostRequestThroughDraggedModels(runIndex) {
    this.currentExecuteNodeIndex = runIndex;
    if (runIndex <= this.draggedNodes.length - 1) {
      if (this.draggedNodes[runIndex].key == 'cluster_corrections') {
        //TODO:
        this.loadClusterCorrections();
        this.showUpdateMap();
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 2000);
        this.draggedNodes[runIndex].isRunning = true;
        return;
      }
      if (this.draggedNodes[runIndex].key == 'distribution_network') {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 2000);
        this.draggedNodes[runIndex].isRunning = true;
      }
      this.draggedNodes[runIndex].isRunning = true;
      this.terminalDetails.push(
        this.draggedNodes[runIndex].name + ' run started .....'
      );
      this.httpClient
        .post(
          this.draggedNodes[runIndex].form.endpointApi,
          this.draggedNodes[runIndex].formData
        )
        .subscribe(
          (res) => {
            this.draggedNodes[runIndex].result = res;
            this.terminalDetails.push(
              this.draggedNodes[runIndex].name + ' run completed successfully'
            );
            this.showUpdateMap();
          },
          (err) => {
            console.error(err);
            this.draggedNodes[runIndex].hasError = true;
            this.terminalDetails.push(
              this.draggedNodes[runIndex].name + ' run completed with error'
            );
          },
          () => {
            this.draggedNodes[runIndex].isRunning = false;
            this.draggedNodes[runIndex].isCompleted = true;
            this.loopPostRequestThroughDraggedModels(runIndex + 1);
          }
        );
    }
  }

  showUpdateMap() {
    setTimeout(() => {
      for (let i = 0; i < this.draggedNodes.length; i++) {
        if (
          this.draggedNodes[i].key != 'cluster_corrections' &&
          this.draggedNodes[i].result
        ) {
          this.mapComponent.removeLayerByModelName(
            this.draggedNodes[i].modelName
          );
          switch (this.draggedNodes[i].key) {
            case 'node_placements':
              if (this.draggedNodes[i].result.status === 200) {
                for (
                  let j = 0;
                  j < this.draggedNodes[i].result.table_name.length;
                  j++
                ) {
                  if (
                    this.draggedNodes[i].result.table_name[j] ==
                      'joined_cluster_id' ||
                    this.draggedNodes[i].result.table_name[j] ==
                      'outlier_output'
                  ) {
                    continue;
                  }
                  this.mapComponent.addWmsLayer(
                    this.draggedNodes[i].result.workspace_name +
                      ':' +
                      'sample_flask_' +
                      this.draggedNodes[i].result.table_name[j],
                    'Point',
                    this.draggedNodes[i].modelName
                  );
                }
              }
              break;
            case 'bf_page':
            case 'secondary_core_page':
            case 'secondary_drop_ug_page':
            case 'secondary_dis_page':
            case 'secondary_add_page':
            case 'secondary_nodeboundary':
            case 'secondary_clusterbndry':
            case 'secondary_hybrid_np':
            case 'secondary_nodeboundary':
            case ',secondary_cp':
              if (this.draggedNodes[i].result.status === 200) {
                for (
                  let j = 0;
                  j < this.draggedNodes[i].result.table_name.length;
                  j++
                ) {
                  if (this.draggedNodes[i].result.table_name[j]) {
                    this.mapComponent.addWmsLayer(
                      this.draggedNodes[i].result.workspace_name +
                        ':' +
                        'sample_flask_' +
                        this.draggedNodes[i].result.table_name[j],
                      'Point',
                      this.draggedNodes[i].modelName
                    );
                  }
                }
              }
              break;
            case 'node_boundary':
              if (this.draggedNodes[i].result.status === 200) {
                this.mapComponent.addWmsLayer(
                  this.draggedNodes[i].result.workspace +
                    ':' +
                    this.draggedNodes[i].result.sample_flask,
                  'Polygon',
                  this.draggedNodes[i].modelName
                );
              }
              break;
            case 'distribution_network':
              if (this.draggedNodes[i].result.status === 200) {
                this.mapComponent.addWmsLayer(
                  this.draggedNodes[i].result.workspace_name +
                    ':' +
                    'sample_flask_' +
                    this.draggedNodes[i].result.table_name[0],
                  'Point',
                  this.draggedNodes[i].modelName
                );
                this.mapComponent.addWmsLayer(
                  this.draggedNodes[i].result.workspace_name +
                    ':' +
                    'sample_flask_' +
                    this.draggedNodes[i].result.table_name[1],
                  'Point',
                  this.draggedNodes[i].modelName
                );
              }
              break;
          }
        }
      }
    }, 1000);
  }
  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      //this.hideDialog();
    }
  }

  loadClusterCorrections() {
    this.httpClient
      .get(
        this.mainApi + 'load_data?username=' + localStorage.getItem('username')
      )
      .subscribe((res) => {
        for (var i = 0; i < res['cluster_id'].length; i++) {
          console.log(res['cluster_id'][i]);
          this.outliers_data.push({
            cluster_id: res['cluster_id'][i],
            sum_pon_homes: res['sum_pon_homes'][i],
          });
        }
      });
  }

  onSubmitClusterCorrection() {
    const formData = new FormData();
    formData.append(
      'input_cluster_id',
      this.clusterCorrectionForm.value.input_cluster_id
    );
    formData.append(
      'output_cluster_id',
      this.clusterCorrectionForm.value.output_cluster_id
    );
    formData.append(
      'gis_tool_id',
      this.clusterCorrectionForm.value.gis_tool_id
    );
    formData.append('username', localStorage.getItem('username'));

    this.loadingLoader = true;
    this.httpClient.post(`${this.mainApi}update_db`, formData).subscribe(
      (res) => {
        this.outliers_data = [];
        for (var i = 0; i < res['cluster_id'].length; i++) {
          console.log(res['cluster_id'][i]);
          this.outliers_data.push({
            cluster_id: res['cluster_id'][i],
            sum_pon_homes: res['sum_pon_homes'][i],
          });
        }
        this.mapComponent.removeLayerByModelName(
          this.draggedNodes[this.currentExecuteNodeIndex].modelName
        );
        this.mapComponent.addWmsLayer(
          res['workspace_name'] + ':' + res['table_name'],
          'geometryType',
          'cluster_corrections' +
            this.draggedNodes[this.currentExecuteNodeIndex].modelName
        );
      },
      (err) => {
        console.error(err);
      },
      () => {
        this.loadingLoader = false;
      }
    );
  }

  executeNextModel() {
    this.draggedNodes[this.currentExecuteNodeIndex].isRunning = false;
    this.draggedNodes[this.currentExecuteNodeIndex].isCompleted = true;
    this.currentExecuteNodeIndex += 1;
    if (this.currentExecuteNodeIndex > this.draggedNodes.length - 1) {
    } else {
      window.scrollTo(0, 0);
      this.loopPostRequestThroughDraggedModels(this.currentExecuteNodeIndex);
    }
  }

  export() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    this.httpClient
      .post(environment.api + '/api/export_output', formData)
      .subscribe(
        (res) => {
          this.httpClient
            .post('/api/download_qgis_files', formData, {
              responseType: 'arraybuffer',
            })
            .subscribe(
              (res2: any) => {
                let blob = new Blob([res2], { type: 'application/zip' });
                let url = window.URL.createObjectURL(blob);
                let pwa = window.open(url);
                if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                  alert('Please disable your Pop-up blocker and try again.');
                }

                alert('completed successfully');
                this.loadingLoader = false;
                this.exportStatus = 'success';
              },
              (err2) => {
                console.error(err2);
                alert(' completed with error');
                this.loadingLoader = false;
                this.exportStatus = 'fail';
              },
              () => {
                this.loadingLoader = false;
              }
            );
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.loadingLoader = false;
          this.exportStatus = 'fail';
        },
        () => {}
      );
  }
}
