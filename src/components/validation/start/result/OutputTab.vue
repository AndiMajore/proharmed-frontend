<template>
  <div>
    <div style="display:flex">
      <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Tabular results
      </v-subheader>
      <v-tooltip top>
        <template v-slot:activator="{attrs, on}">
          <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                 style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 12px">
            <v-icon>fas fa-download</v-icon>
          </v-btn>
        </template>
        <div>Download all files as .zip</div>
      </v-tooltip>
    </div>
    <v-container>
      <v-row justify="center" style="padding-top:16px; padding-bottom: 16px">
        <v-col cols="12" lg="6" style="display: flex; justify-content: center">
          <div>
            <b>Empirical P-values</b>
            <v-simple-table v-if="mode!=='cluster'">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('p-value_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                      :key="'p_value-head'+head">
                    <div style="white-space: nowrap">
                      {{ head }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric"
                    @click="distributionMeasure=metric" style="cursor: pointer">
                  <td style="margin:4px">
                    <b style="color: rgba(0,0,0,0.6)">
                      <div style="white-space: nowrap"
                           :style="{color: distributionMeasure===metric ? 'cornflowerblue':''}">
                        {{ metric }}
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon small v-bind="attrs" v-on="on" :color="distributionMeasure===metric ? 'primary':''">
                              far fa-question-circle
                            </v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                        </v-tooltip>
                      </div>
                    </b>
                  <td v-for="head in Object.keys(result.p_values.values)" :key="'p_value-'+head"
                      style="margin:4px">
                    <span v-show="distributionMeasure!==metric">{{
                        formatValue(result.p_values.values[head][metric])
                      }}</span>
                    <b v-show="distributionMeasure === metric"
                       style="color: cornflowerblue">{{ formatValue(result.p_values.values[head][metric]) }}</b>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-simple-table v-if="mode==='cluster'">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('p-value_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                      :key="'p_'+head">
                    <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                         @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.p_values.values).indexOf(head)">
                      <span v-show="head !== clusterMeasure">{{ head }}</span>
                      <b style="color: cornflowerblue; text-decoration: underline"
                         v-show="head===clusterMeasure">{{
                          head
                        }}</b>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right :style="{'color': clusterMeasure===head? 'cornflowerblue':''}" small
                                  v-bind="attrs" v-on="on">far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
                  <td :style="{margin: mobile ? '1px':'4px'}" @click="distributionMeasure=metric">
                    <b style="color: rgba(0,0,0,0.6); cursor: pointer">
                      <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                        <b v-show="metric===distributionMeasure"
                           style="color: cornflowerblue; text-decoration: underline">{{ metric }}</b>
                        <span v-show="metric !== distributionMeasure">{{ metric }}</span>
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on"
                                    :color="metric===distributionMeasure? 'primary': ''">far fa-question-circle
                            </v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                        </v-tooltip>
                      </div>
                    </b></td>
                  <td :style="{margin: mobile ? '1px':'4px'}"
                      v-for="head in Object.keys(result.p_values.values)"
                      :key="metric+head" style="cursor: pointer"
                      @click="distributionMeasure=metric; clusterMeasure=head;clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head) ">
                    <b v-show="head===clusterMeasure || metric===distributionMeasure"
                       :style="{'color':'cornflowerblue','text-decoration': (head===clusterMeasure && metric===distributionMeasure) ? 'underline':'none'}">{{
                        formatValue(result.p_values.values[head][metric])
                      }}</b>
                    <span v-show="head !== clusterMeasure && metric!==distributionMeasure">{{
                        formatValue(result.p_values.values[head][metric])
                      }}</span>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
        <v-col cols="12" lg="6" style="display: flex; justify-content: center">
          <div>
            <b>{{ getScoreName() }}</b>
            <v-simple-table style="max-width:500px" v-if="mode!=='cluster'">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('input_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.input_values.values)"
                      :key="'input_'+head">
                    <div style="white-space: nowrap">
                      {{ head }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])" :key="metric"
                    @click="distributionMeasure=metric" style="cursor: pointer">
                  <td style="margin:4px"><b style="color: rgba(0,0,0,0.6)">
                    <div style="white-space: nowrap"
                         :style="{color: distributionMeasure===metric ? 'cornflowerblue':''}">
                      {{ metric }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on" :color="distributionMeasure===metric ? 'primary':''">
                            far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                      </v-tooltip>
                    </div>
                  </b>
                  <td v-for="head in Object.keys(result.input_values.values)" :key="'input_value-'+head"
                      style="margin:4px"><span v-show="distributionMeasure!==metric">{{
                      formatValue(result.input_values.values[head][metric])
                    }}</span>
                    <b v-show="distributionMeasure === metric"
                       style="color: cornflowerblue">{{ formatValue(result.input_values.values[head][metric]) }}</b>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-simple-table v-if="mode==='cluster'">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('input_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.input_values.values)"
                      :key="'p_'+head">
                    <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                         @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
                      <span v-show="head !== clusterMeasure">{{ head }}</span>
                      <b style="color: cornflowerblue; text-decoration: underline"
                         v-show="head===clusterMeasure">{{
                          head
                        }}</b>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right :style="{'color': clusterMeasure===head? 'cornflowerblue':''}" small
                                  v-bind="attrs" v-on="on">far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])"
                    :key="metric">
                  <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6); cursor: pointer"
                                                                 @click="distributionMeasure=metric">
                    <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                      <b v-show="metric===distributionMeasure"
                         style="color: cornflowerblue; text-decoration: underline">{{ metric }}</b>
                      <span v-show="metric !== distributionMeasure">{{ metric }}</span>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right small v-bind="attrs" v-on="on"
                                  :color="metric===distributionMeasure? 'primary': ''">far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                      </v-tooltip>
                    </div>
                  </b></td>
                  <td :style="{margin: mobile ? '1px':'4px'}"
                      v-for="head in Object.keys(result.input_values.values)"
                      :key="metric+head" style="cursor: pointer"
                      @click="distributionMeasure=metric; clusterMeasure=head;clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
                    <b v-show="head===clusterMeasure || metric===distributionMeasure"
                       :style="{'color':'cornflowerblue','text-decoration': (head===clusterMeasure && metric===distributionMeasure) ? 'underline':'none'}">{{
                        formatValue(result.input_values.values[head][metric])
                      }}</b>
                    <span v-show="head !== clusterMeasure && metric!==distributionMeasure">{{
                        formatValue(result.input_values.values[head][metric])
                      }}</span>
                    <!--                                {{ formatValue(result.input_values.values[head][metric]) }}-->
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <template v-if="plots">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Annotation selection</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top:16px; padding-bottom: 16px">
          <v-col cols="7" md="3" v-if="mode==='cluster'" style="display: flex; justify-content: center">
            <v-select label="Scoring type" style="max-width: 200px" dense outlined filled
                      :items="measureMap['clustering']" v-model="clusterMeasure"></v-select>
          </v-col>
          <v-col cols="7" md="3" style="display: flex; justify-content: center">
            <v-select label="Annotation type" style="max-width: 200px" dense outlined filled :items="!this.referenceType || this.referenceType.length === 0 || this.type === this.referenceType ? termMap[type] : ['KEGG']"
                      v-model="distributionMeasure" ></v-select>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Significance figures</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
          <v-col cols="12" lg="6" class="flex_content_center">
            <v-img :src="getPlot('p-value')" contain style="position: relative; max-width: 70%" v-if="mode!=='cluster'">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('p-value'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
            <v-img :src="getPlot(clusterMeasure+'_p-value')" contain v-if="mode==='cluster'"
                   style="position: relative; max-width: 70% ">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" lg="6" class="flex_content_center">
            <v-img :src="getPlot(getDistPlotName())" contain
                   style="position: relative" max-width="90%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot(getDistPlotName()))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>

      </v-container>
      <v-divider></v-divider>
      <template v-if="input.sigCont">
        <div style="display: flex; justify-content: center">
          <v-subheader>Significance contribution</v-subheader>
        </div>
        <v-container v-if="scDone">
          <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
            <v-col cols="12" lg="6" class="flex_content_center">
              <v-data-table :headers="getSCTableHeader(clusterMeasure)" :items="getSCTableItems(clusterMeasure)" dense>
                <template v-slot:header.GO.BP="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:header.GO.MF="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:header.GO.CC="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:header.KEGG="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:header.related_genes="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:header.related_variants="{ header }">
                  <b v-show="header.text === distributionMeasure" style="color: cornflowerblue">{{ header.text }}</b>
                  <b v-show="header.text !== distributionMeasure"
                     @click="distributionMeasure= header.text">{{ header.text }}</b>
                </template>
                <template v-slot:item.GO.BP="{ item }">
                  <b v-show="'GO.BP'===distributionMeasure" style="color: cornflowerblue">{{ item['GO.BP'] }}</b>
                  <span v-show="'GO.BP'!== distributionMeasure">{{ item['GO.BP'] }}</span>
                </template>
                <template v-slot:item.GO.MF="{ item }">
                  <b v-show="'GO.MF'===distributionMeasure" style="color: cornflowerblue">{{ item['GO.MF'] }}</b>
                  <span v-show="'GO.MF'!== distributionMeasure">{{ item['GO.MF'] }}</span>
                </template>
                <template v-slot:item.GO.CC="{ item }">
                  <b v-show="'GO.CC'===distributionMeasure" style="color: cornflowerblue">{{ item['GO.CC'] }}</b>
                  <span v-show="'GO.CC'!== distributionMeasure">{{ item['GO.CC'] }}</span>
                </template>
                <template v-slot:item.related_genes="{ item }">
                  <b v-show="'related_genes'===distributionMeasure"
                     style="color: cornflowerblue">{{ item['related_genes'] }}</b>
                  <span v-show="'related_genes'!== distributionMeasure">{{ item['related_genes'] }}</span>
                </template>
                <template v-slot:item.related_variants="{ item }">
                  <b v-show="'related_variants'===distributionMeasure"
                     style="color: cornflowerblue">{{ item['related_variants'] }}</b>
                  <span v-show="'related_variants'!== distributionMeasure">{{ item['related_variants'] }}</span>
                </template>
                <template v-slot:item.KEGG="{ item }">
                  <b v-show="'KEGG'===distributionMeasure" style="color: cornflowerblue">{{ item['KEGG'] }}</b>
                  <span v-show="'KEGG'!== distributionMeasure">{{ item['KEGG'] }}</span>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot('absolute_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%"
                         v-if="mode !== 'cluster'">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('absolute_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <v-img :src="getPlot(clusterMeasure+'_absolute_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%" v-else>
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot(clusterMeasure+'_absolute_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                </div>
                <div class="flex_content_center">
                  <v-tooltip right v-if="type === 'gene' && topSCGenes">
                    <template v-slot:activator="{on, attrs}">
                      <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                        <a :href="getGProfilerUrl(mode ==='cluster' ? topSCGenes[clusterMeasure]['absolute'] : Object.values(topSCGenes)[0]['absolute'])"
                           target="_blank">functional enrichment (g:Profiler)</a>
                        <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                      </v-chip>
                    </template>
                    <div style="width: 200px; text-align: justify">Show the functional enrichment for the top absolute
                      contributing genes in g:Profiler.
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot(distributionMeasure+'_positive_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%" v-if="mode !== 'cluster'">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot(distributionMeasure+'_positive_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <v-img :src="getPlot(clusterMeasure+'_'+distributionMeasure+'_positive_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%" v-else>
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot(clusterMeasure+'_'+distributionMeasure+'_positive_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                </div>
                <div class="flex_content_center">
                  <v-tooltip right v-if="type === 'gene'  && topSCGenes">
                    <template v-slot:activator="{on, attrs}">
                      <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                        <a :href="getGProfilerUrl(mode ==='cluster' ? topSCGenes[clusterMeasure][distributionMeasure]['positive'] : Object.values(topSCGenes)[0][distributionMeasure]['positive'])"
                           target="_blank">functional enrichment (g:Profiler)</a>
                        <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                      </v-chip>
                    </template>
                    <div style="width: 200px; text-align: justify">Show the functional enrichment for the top positive
                      contributing genes in g:Profiler.
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </v-col>
            <v-col cols="12" lg="6" class="flex_content_center">
              <div style="width: 100%">
                <div class="flex_content_center">
                  <v-img :src="getPlot(distributionMeasure+'_negative_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%" v-if="mode !== 'cluster'">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot(distributionMeasure+'_negative_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <v-img :src="getPlot(clusterMeasure+'_'+distributionMeasure+'_negative_contribution_heatmap')" contain
                         style="position: relative; max-width: 70%" v-else>
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot(clusterMeasure+'_'+distributionMeasure+'_negative_contribution_heatmap'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                </div>
                <div class="flex_content_center">
                  <v-tooltip right v-if="type === 'gene'  && topSCGenes">
                    <template v-slot:activator="{on, attrs}">
                      <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                        <a :href="getGProfilerUrl(mode ==='cluster' ? topSCGenes[clusterMeasure][distributionMeasure]['negative'] : Object.values(topSCGenes)[0][distributionMeasure]['negative'])"
                           target="_blank">functional enrichment (g:Profiler)</a>
                        <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                      </v-chip>
                    </template>
                    <div style="width: 200px; text-align: justify">Show the functional enrichment for the top negative
                      contributing genes in g:Profiler.
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="mode === 'subnetwork'" justify="center" style="padding-top: 16px; padding-bottom: 16px">
            <v-col cols="12" lg="6" class="flex_content_center">
              <v-img :src="getPlot(distributionMeasure+'_contribution_graph')" contain
                     style="position: relative; max-width: 70%">
                <v-btn icon small style="position: absolute; right: 0"
                       @click="downloadFile(getPlot(distributionMeasure+'_contribution_graph'))">
                  <v-icon small>fas fa-download</v-icon>
                </v-btn>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
            <v-col cols="12">
              <div v-if="scStatus" style="width: 100%" class="flex_content_center"><i>Significance contribution
                calculation: {{ scStatus.done }} of {{ scStatus.total }} done!
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon v-on="on" v-bind="attrs" style="top:-2px" left size="1.2rem">far fa-question-circle</v-icon>
                  </template>
                  <div style="width: 300px; text-align: justify">These tasks are executed with lower priority to not
                    block
                    other incoming significance calculation tasks.
                  </div>
                </v-tooltip>
              </i></div>
              <v-progress-linear v-if="scStatus" :value="scStatus.done/scStatus.total*100"></v-progress-linear>
              <v-progress-linear v-else indeterminate></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
      </template>
      <div style="display: flex; justify-content: center">
        <v-subheader>Mappability figures</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
          <v-col cols="12" lg="6" class="flex_content_center">
            <v-img :src="getPlot('mappability')" contain style="margin:16px; position: relative" max-width="70%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('mappability'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" lg="6" class="flex_content_center">
            <v-img :src="getPlot(getAnnotationPlotName())" contain style="margin:16px; position: relative"
                   max-width="90%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot(getAnnotationPlotName()))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" lg="6" class="flex_content_center">
            <v-img :src="getPlot(getSankeyPlotName())" contain style="margin:16px; position: relative; max-width:80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot(getSankeyPlotName()))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
      <template v-if="type==='gene'">
        <v-divider></v-divider>
        <div style="display: flex; justify-content: center">
          <v-subheader>
            External resources
          </v-subheader>
        </div>
        <v-container>
          <v-row justify="center" v-if="type==='gene'">
            <v-col :cols="3" style=" margin:16px">
              <b>Functional enrichment (g:Profiler)</b>
              <v-container v-if="mode==='cluster'">
                <v-row justify="center">
                  <v-col cols="12" v-if="input && input.target">
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target.map(e=>e.id))" target="_blank">All</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                        target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                    <v-tooltip right v-for="cluster in getClusterNames(input.target)"
                               :key="cluster+'_gprofiler'">
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target.filter(e=>e.cluster===cluster).map(e=>e.id))"
                             target="_blank">{{ cluster }}</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                        {{ cluster }} cluster
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-row justify="center">
                  <v-col cols="12" class="flex_content_center">
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.target)" target="_blank">Targets</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                    <v-tooltip right v-if="input.reference">
                      <template v-slot:activator="{on, attrs}">
                        <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                          <a :href="getGProfilerUrl(input.reference)" target="_blank">References</a>
                          <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                        </v-chip>
                      </template>
                      <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                        genes in g:Profiler.
                      </div>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "OutputTab",
  props: {
    mode: String,
    type: String,
    csvs: Array,
    plots: Array,
    input: Object,
    result: Object,
    referenceType: String,
    taskID: String,
    zips: Array,
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tooltips: {
        'DI-based': "Dunn Index: ratio of the cluster with the lowest density compared to the two clusters that are closest to each other.",
        'SS-based': "Silhouette Score: measures how well an observation is clustered and it estimates the average distance between clusters.",
        'DBI-based': "Davies Bouldin Index: measures how dense clusters are iin comparison to distances between each cluster pair.",
        p_values: "Empirical P-value calculated on input score(s) with respect to chosen background model.",
        set_value: "Calculated input score based on functional or genetic coherence.",
        'GO.BP': "based on functional coherence of biological process annotations from Gene Ontology (GO).",
        'GO.CC': "based on functional coherence of cell component annotations from Gene Ontology (GO).",
        'GO.MF': "based on functional coherence of molecular function annotations process from Gene Ontology (GO).",
        'KEGG': "based on functional coherence of pathways annotations from Kyoto Encyclopedia of Genes and Genomes (KEGG)",
        'JI-based': "Jaccard Index based: calculated by the intersection of two sets divided by the union of both.",
        'OC-based': "Overlap Coefficient based: calculated by the intersection of two sets divided by the size of the smaller set.",
        'related_variants': 'TODO',
        'related_genes': 'TODO',
      },
      scDone: false,
      scResult: undefined,
      scStatus: undefined,
      clusterMeasure: 'DI-based',
      clusterMeasureIdx: 0,
      distributionMeasure: '',
      topSCGenes: undefined,
      measureMap: {
        'clustering': ['DI-based', 'SS-based', 'DBI-based'],
      },
      termMap: {
        'gene': ['GO.BP', 'GO.CC', 'GO.MF', 'KEGG'],
        'disease': ['related_genes', 'related_variants', 'KEGG']
      },
    }
  },

  created() {
    this.distributionMeasure = !this.referenceType || this.referenceType.length === 0 || this.referenceType === this.type ? this.termMap[this.type][0] : 'KEGG'
    if (this.input.sigCont)
      this.queryScStatus()
  },

  methods: {
    queryScStatus: async function () {
      let status = await this.$http.get("sc_status?task=" + this.taskID).then((response) => {
        if (response.data)
          return response.data
      })
      this.scStatus = status.status
      if (status.done) {
        this.$emit("reloadFiles")
        this.scResult = await this.$http.get("sc_results?task=" + this.taskID).then((response) => {
          if (response.data)
            return response.data
        })
        if (this.type === 'gene') {
          this.topSCGenes = await this.$http.get("sc_top_results?task=" + this.taskID).then((response) => {
            return response.data
          })
        }
        this.scDone = true
      } else

        setTimeout(() => this.queryScStatus(), 5000)
    },


    downloadFile: function (file) {
      this.$emit('downloadEvent', file)
    }
    ,
    getCSV: function (name) {
      return this.csvs.filter(csv => csv.includes(name))[0]
    }
    ,

    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    }
    ,

    getPlot: function (name) {
      let url = this.plots.filter(plot => plot.includes(name))[0]
      if (url)
        return url
      return "https://www.schulz-grafik.de/wp-content/uploads/2018/03/placeholder.png"
    },

    getSCTableHeader: function (measure) {
      let results = this.getSCTableData(measure)
      let headers = [{text: 'Gene', align: 'start', sortable: true, value: 'gene'}]
      Object.keys(results[Object.keys(results)[0]]).forEach(h => {
        headers.push({text: h, align: 'start', sortable: true, value: h})
      })
      return headers
    },

    getSCTableData: function (measure) {
      if (this.mode === 'cluster')
        return this.scResult[measure]
      else
        return this.scResult[Object.keys(this.scResult)[0]]
    },

    getSCTableItems: function (measure) {
      let data = this.getSCTableData(measure)
      let items = []
      Object.keys(data).forEach(gene => {
        let item = {gene: gene}
        Object.keys(data[gene]).forEach(h => {
          item[h] = this.formatValue(data[gene][h])
        })
        items.push(item)
      })
      return items
    },

    getScoreName: function () {
      if (this.mode === 'set-set') {
        if (this.type === 'gene' || this.referenceType === 'gene') {
          return 'Functional relevance score'
        }
        return 'Functional relevance score & genetic relevance score'
      } else {
        return this.type === 'gene' ? 'Functional relevance score' : 'Genetic relevance score'
      }
    },

    getSankeyPlotName: function () {
      return this.distributionMeasure + "_sankey"
    },


    getAnnotationPlotName: function () {
      return this.distributionMeasure + "_annotation_distribution"
    },
    getDistPlotName: function () {
      if (this.mode === "cluster")
        return this.clusterMeasure + "_" + this.distributionMeasure + "_distribution"
      return this.distributionMeasure + "_distribution"
    },
    formatValue: function (value) {
      if (typeof value === "number") {
        value = value + ""
      }
      if (typeof value === "string") {
        let idx = value.indexOf(".")
        let decimals = this.mobile ? 4 : 6;
        return value.length > (decimals + 2) ? value.substring(0, Math.max(decimals + 2, idx)) : value
      }
      return value
    },
    getClusterNames: function (clustering) {
      const uniq = []
      clustering.map(e => e.cluster).forEach(e => {
        if (uniq.indexOf(e) === -1)
          uniq.push(e)
      })
      return uniq
    },

    getGProfilerUrl: function (list) {
      const queryString = list.join('%0A');
      const url = 'http://biit.cs.ut.ee/gprofiler/gost?' +
          'organism=hsapiens&' +
          `query=${queryString}&` +
          'ordered=false&' +
          'all_results=false&' +
          'no_iea=false&' +
          'combined=false&' +
          'measure_underrepresentation=false&' +
          'domain_scope=annotated&' +
          'significance_threshold_method=g_SCS&' +
          'user_threshold=0.05&' +
          'sources=GO:MF,GO:CC,GO:BP,KEGG,TF,REAC,MIRNA,HPA,CORUM,HP,WP'
      return url
    },

  }
}
</script>

<style scoped lang="sass">

.v-subheader
  font-size: 1.5rem
  margin-top: 8px

.sh_mobile
  font-size: 1.2rem

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.margin_mobile
  padding-left: 8px
  padding-right: 8px

.flex_self_center
  display: flex
  justify-self: center
  margin-left: auto !important
  margin-right: auto !important

.flex_self_start
  justify-self: flex-start
  margin-right: auto !important
  margin-left: 0 !important

.flex_self_start_alt
  justify-self: flex-start
  margin-right: auto !important
  margin-left: auto !important

.flex_self_end
  justify-self: flex-end
  margin-right: 0 !important
  margin-left: auto !important

.flex_self_end_alt
  justify-self: flex-end
  margin-right: auto !important
  margin-left: auto !important

.flex_content_center
  justify-content: center
  display: flex

</style>