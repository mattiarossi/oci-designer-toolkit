# OCI Designer Toolkit Development Guide
The following worked example will take you through the required steps to add a new artifact to OKIT. This will be based 
on adding Block Storage Volumes to OKIT. Adding an artifact to OKIT will require a number files to be created and a few 
modified the following steps will document the procedure specifying where the files will need to be created and the names 
to be used.


## Table of Contents

1. [Adding an Artifact](#adding-an-artifact)
2. [Naming Convention](#naming-convention)
3. [Palette SVG](#palette-svg)
4. [Artifact Javascript](#artifact-javascript)
    1. [Standard Definitions](#standard-definitions)
    2. [Class Definition](#class-definition)
    3. [Ready Function](#ready-function)
5. [Properties HTML](#properties-html)
6. [Python OCI Facade](#python-oci-facade)
7. [Terraform Jinja2 Template](#terraform-jinja2-template)
8. [Ansible Jinja2 Template](#ansible-jinja2-template)
9. [OKIT Class](#okit-class)
    1. [New Artifact](#newartifact)
    2. [Get Artifact](#getartifact)
    3. [Delete Artifact](#deleteartifact)
10. [Flask Web Designer Python](#flask-web-designer-python)
11. [Connection Facade](#connection-facade)
12. [Python Generator](#python-generator)


## Adding an Artifact
The following files will need to be created and the directories specified are relative to the project root. You will notice 
that the files have a specfic naming convention and this is important because it allows the wrapper code to work with the
minimum of cross file editing / multi developer editing. As a result it greatly simplifies the addition of new artifacts 
to the system. 

- New Files
    - Frontend
        - **[Palette SVG](#palette-svg)**                             : [okitweb/static/okit/palette/storage/*Block_Storage_Volume*.svg](../okitweb/static/okit/palette/storage/Block_Storage_Volume.svg)
        - **[Artifact Model Javascript](#artifact-javascript)**       : [okitweb/static/okit/model/js/artefacts/*block_storage_volume*.js](../okitweb/static/okit/model/js/artefacts/block_storage_volume.js)
        - **[Properties HTML](#properties-html)**                     : [okitweb/templates/okit/propertysheets/*block_storage_volume*.html](../okitweb/templates/okit/propertysheets/block_storage_volume.html)
    - Backend
        - **[Python OCI Facade](#python-oci-facade)**                 : [visualiser/facades/oci*BlockStorageVolume*.py](../visualiser/facades/ociBlockStorageVolume.py)
        - **[Terraform Jinja2 Template](#terraform-jinja2-template)** : [visualiser/templates/terraform/*block_storage_volume*.jinja2](../visualiser/templates/terraform/block_storage_volume.jinja2)
        - **[Ansible Jinja2 Template](#ansible-jinja2-template)**     : [visualiser/templates/ansible/*block_storage_volume*.jinja2](../visualiser/templates/ansible/block_storage_volume.jinja2)
- Updated Files
    - Frontend
        - **[OKIT Class](#okit-class)**                               : [okitweb/static/okit/js/*okit*.js](../okitweb/static/okit/js/okit.js)
        - **[Flask Web Designer Python](#flask-web-designer-python)** : [okitweb/*okitWebDesigner*.py](../okitweb/okitWebDesigner.py)
    - Backend
        - **[Connection Facade](#connection-facade)**                 : [visualiser/facades/*ociConnection*.py](../visualiser/facades/ociConnection.py)
        - **[Python OCI Query](#python-oci-query)**                   : [visualiser/common/*ociQuery*.py](../visualiser/common/ociQuery.py)
        - **[Python Generator](#python-generator)**                   : [visualiser/generators/*ociGenerator*.py](../visualiser/generators/okitGenerator.py)

## Naming Convention
All files associated with an artifact will have file names based on the artifact. If we take the ***Block Storage Volume***
artifact as an example it can be seen, from above, that all files are named in the same fashion with the exception of the
palette SVG file. 

All files must be named as per artifact name with the spaces replaced by underscores and converted to lowercase. The exception 
to this is the palette SVG where title case should be used instead of lower case. The reason for this is that the palette
file name will be manipulated (removing the underscore) and used to dynamically reference all Javascript function names.  

## Palette SVG
The palette svg defines the icon that will be displayed in the Drag & Drop palette. A number of existing SVG files can be
downloaded from the confluence page OCI Icon Set draw.io Stencils.

One key requirement for this svg file is that all elements that draw the icon be contained within an "g" tag. The reason
for this is that the common javascript svg display routine will look for this and extract it to use as the definition for
the icon. Hence the Block Storage Volume would look like the following

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" x="0px"
     y="0px"
     viewBox="0 0 288 288" style="enable-background:new 0 0 288 288;" xml:space="preserve">
<style type="text/css">
	.icon-colour-01{fill:#F80000;}
</style>
    <g transform="translate(-140, -140) scale(2, 2)">
		<path class="icon-colour-01"
			  d="M172.6,88.4c-13.7-1.6-28-1.6-28.6-1.6c-0.6,0-14.8,0-28.6,1.6c-24,2.8-24.2,7.8-24.2,7.9v95.5c0,0,0.3,5,24.2,7.9c13.7,1.6,28,1.6,28.6,1.6c0.6,0,14.8,0,28.6-1.6c24-2.8,24.2-7.8,24.2-7.9V96.3C196.8,96.2,196.5,91.2,172.6,88.4z M137.2,180.7h-18.9v-18.9h18.9V180.7z M137.2,146.5h-18.9v-18.9h18.9V146.5z M168.1,180.7h-18.9v-18.9h18.9V180.7z M168.1,146.5h-18.9v-18.9h18.9V146.5z M192.8,104.1c-1.8,2.8-18.9,7.5-48.3,7.5c-29.4,0-46.5-4.7-48.3-7.5c0,0,0,0,0,0c1.7-2.8,18.8-7.6,48.3-7.6C174,96.5,191.1,101.2,192.8,104.1C192.8,104.1,192.8,104.1,192.8,104.1z"/>
	</g>
</svg>
```

Although the svg will display in the palette image without the "g" it will cause the designer to fail later if it is missing.

## Artifact Javascript
When creating an Artefact you will need to define two artefact specific files that provide the Model Definition and the associated Designer View
functionality. The artifact javascript files are the key files for the BUI specifying all core code for the creation, drawing and querying 
of the artifact. Each file has a standard set of variable definitions and function definitions which again are based on 
the name of the artifact as follows. 

All the example code in the following sections will be based on the **Block Storage Volume** Artefact.

### Artefact Model
The Model javascript will be located in [okitweb/static/okit/model/js/artefacts](../okitweb/static/okit/model/js/artefacts) 
directory and contains the definition of the Artefact and all properties will be in a structured format. Before fixing your
model check the structure return from an OCI SDK Query of the Artefact.

#### Class Definition
Each artifact is described by a JavaScript class inherited from the **OkitArtifact** Class and has a number of standard 
methods associated with the class. for the majority of these you will not need to modify the code because the underlying
super class will do all the work. 

The following will list the methods that need modification.

#### Constructor
```javascript
    /*
    ** Create
     */
    constructor (data={}, okitjson={}) {
        super(okitjson);
        // Configure default values
        this.display_name = this.generateDefaultName(okitjson.block_storage_volumes.length + 1);
        this.compartment_id = data.parent_id;
        this.availability_domain = '1';
        this.size_in_gbs = 1024;
        this.backup_policy = 'bronze';
        this.vpus_per_gb = '10';
        // Update with any passed data
        this.merge(data);
        this.convert();
        // Check if built from a query
        if (this.availability_domain.length > 1) {
            this.region_availability_domain = this.availability_domain;
            this.availability_domain = this.region_availability_domain.slice(-1);
        }
    }
```
This function is used to create a new json element to the OKIT json structure. The elements within this json will match those 
that are returned from querying OCI. All artifacts will be contained within a top level list with a name that matches that
of the artifact (e.g. block_storage_volumes). Once that new json element has been added it will be drawn on the SVG canvas using an appropriate View class.

#### Delete Children
```javascript
    /*
    ** Delete Processing
     */
    deleteChildren() {
        // Remove Instance references
        for (let instance of this.getOkitJson().instances) {
            for (let i=0; i < instance.block_storage_volume_ids.length; i++) {
                if (instance.block_storage_volume_ids[i] === this.id) {
                    instance.block_storage_volume_ids.splice(i, 1);
                }
            }
        }
    }
```
Although the main **delete** method will not need modifying the **deleteChildren** will need modification to remove any 
references within linked artifacts or actual children in the case of a container.

### Artefact View
The Model javascript will be located in [okitweb/static/okit/view/designer/js/artefacts](../okitweb/static/okit/view/designer/js/artefacts) 
directory and contains the definition of the SVG representation for the Artefact.

#### Artifact Dimensions
The function is used to calculate the dimensions of the artifact and will be called by container function to determine 
how much space to reserve for drawing this artifact. If you are building a container artifact (e.g. subnet) then this
function will call the dimensions function for all contained artifacts to calculate it's dimensions.

#### Draw
```javascript
    draw() {
        console.group('Drawing ' + this.getArtifactReference() + ' : ' + this.id + ' [' + this.parent_id + ']');
        console.info(`Hide Attached : ${okitSettings.hide_attached}.`)
        console.info(`Is Attached   : ${this.attached}.`)
        if (!okitSettings.hide_attached || !this.attached) {
            console.info(`${this.display_name} is either not attached and we are displaying attached`);
            let svg = super.draw();
        }
        console.groupEnd();
    }

    // Return Artifact Specific Definition.
    getSvgDefinition() {
        let definition = this.newSVGDefinition(this, this.getArtifactReference());
        let first_child = this.getParent().getChildOffset(this.getArtifactReference());
        definition['svg']['x'] = first_child.dx;
        definition['svg']['y'] = first_child.dy;
        definition['svg']['width'] = this.dimensions['width'];
        definition['svg']['height'] = this.dimensions['height'];
        definition['rect']['stroke']['colour'] = stroke_colours.bark;
        definition['rect']['stroke']['dash'] = 1;
        return definition;
    }
``` 
Draws the artifact on the SVG canvas as parted of the dropped component. All artifacts are contained within there own svg
element because we can then drop, where appropriate, other artifacts on them and they become self contained. Once draw we
will add a click event to display the properties associated with this artifact. In the majority of cases this method will
not need modification.

If the artifact can be connected to another then we will also add the standard drag & drop handlers (Mouse Handlers are 
added as well because SVG does not support standard HTML drag & drop events). (See Load Balancer).

#### Load Property Sheet
```javascript
    /*
    ** Property Sheet Load function
     */
    loadProperties() {
        let okitJson = this.getOkitJson();
        let me = this;
        $(jqId(PROPERTIES_PANEL)).load("propertysheets/block_storage_volume.html", () => {loadPropertiesSheet(me);});
    }
```
When the user clicks on the drawn SVG artifact this load function will be called. It will load the artifact specific 
properties sheet into the "properties" pane and then load each of the form fields with the data from the appropriate 
json element. This method will only need modification if the properties sheet needs to select references of other artifacts. 
For an example of this see the Subnet class which will load Route Table and security list information.

### OkitJsonView
To enable the Drag & Drop / Creation functionality you will need to modify the [okitweb/static/okit/view/js/okit_view.js](../okitweb/static/okit/view/js/okit_view.js) 
adding 
```javascript
    // Block Storage
    dropBlockStorageVolumeView(target) {
        console.info('Drop Block Storage Volume View');
        console.info(target);
        let view_artefact = this.newBlockStorageVolume();
        view_artefact.getArtefact().compartment_id = target.id;
        console.info('View Artefact');
        console.info(view_artefact)
        return view_artefact;
    }
    newBlockStorageVolume(volume) {
        this.block_storage_volumes.push(volume ? new BlockStorageVolumeView(volume, this) : new BlockStorageVolumeView(this.okitjson.newBlockStorageVolume(), this));
        return this.block_storage_volumes[this.block_storage_volumes.length - 1];
    }
    getBlockStorageVolumes() {
        return this.block_storage_volumes;
    }
    getBlockStorageVolume(id='') {
        for (let artefact of this.getBlockStorageVolumes()) {
            if (artefact.id === id) {
                return artefact;
            }
        }
        return undefined;
    }
    deleteBlockStorageVolume(id='') {
        this.okitjson.deleteBlockStorageVolume(id);
        this.update();
    }
    loadBlockStorageVolumes(block_storage_volumes) {
        for (const artefact of block_storage_volumes) {
            this.block_storage_volumes.push(new BlockStorageVolumeView(new BlockStorageVolume(artefact, this.okitjson), this));
        }
    }
```

### OkitOCIQuery
To enable query functionality the [okitweb/static/okit/query/oci/js/okit_query.js](../okitweb/static/okit/query/oci/js/okit_query.js) will
need to be modified to provide a new function to query the Artefact and an appropriate call from it's parent should be added.

```javascript
    queryBlockStorageVolumes(request) {
        console.info('------------- Block Storage Volume Query --------------------');
        console.info('------------- Compartment : ' + request.compartment_id);
        let me = this;
        this.region_query_count[request.region]++;
        $.ajax({
            type: 'get',
            url: 'oci/artefacts/BlockStorageVolume',
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify(request),
            success: function(resp) {
                let response_json = JSON.parse(resp);
                regionOkitJson[request.region].load({block_storage_volumes: response_json});
                //okitJsonView.loadBlockStorageVolumes(response_json);
                for (let artefact of response_json) {
                    console.info(artefact.display_name);
                }
                if (request.refresh) {okitJsonView.draw();}
                me.region_query_count[request.region]-- && me.isComplete();
            },
            error: function(xhr, status, error) {
                console.info('Status : ' + status)
                console.info('Error : ' + error)
                me.region_query_count[request.region]-- && me.isComplete();
            }
        });
    }
```
Uses Ajax to call the flask url to initiate an asynchronous query of OCI to retrieve all artifacts and then redraw the 
svg canvas. On completion it will set the query progress for this artifact as complete.

## Properties HTML
The properties html is a simple piece of html that displays the properties associated with the artifact and as a minimum
all required properties must be displayed. The htmi 'id' and 'name' attributes of the input will match the property they
edit.

```html
<!--
** Copyright (c) 2020, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
-->
{% extends "okit/propertysheets/base_property_sheet.html" %}

{% block title_block %}Block Storage Volume{% endblock %}

{% block required_properties_table_rows_block %}
    <div class='tr'><div class='td'>Name</div><div class='td'><input type="text" id="display_name" name="display_name" class="okit-property-value"></div></div>
    <div class='tr'><div class='td'>Availability Domain</div><div class='td'><select id="availability_domain" class="okit-property-value">
        <option value="1" selected="selected">AD 1</option>
        <option value="2">AD 2</option>
        <option value="3">AD 3</option>
    </select></div></div>
{% endblock %}

{% block optional_properties_table_rows_block %}
    <div class='tr'><div class='td'>Size (in GB)</div><div class='td'><input type="text" id="size_in_gbs" name="size_in_gbs" class="okit-property-value"></div></div>
    <div class='tr'><div class='td'>Backup Policy</div><div class='td'><select id="backup_policy" class="okit-property-value">
        <option value="bronze" selected="selected">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
    </select></div></div>
{% endblock %}

{% block optional_properties_block %}{% endblock %}
```

## Python OCI Facade
The python oci facade provides, at a minimum, the functionality to list and filter artifact. All facades have the following
basic processing and provide the key "list" method to retrieve the artifacts during a query.

```python
#!/usr/bin/python

# Copyright (c) 2020, Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

"""Provide Module Description
"""

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
__author__ = ["Andrew Hopkinson (Oracle Cloud Solutions A-Team)"]
__version__ = "1.0.0"
__module__ = "ociBlockStorageVolumes"
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#


import datetime
import getopt
import json
import locale
import logging
import operator
import os
import requests
import sys


import oci
import re
import sys

from facades.ociConnection import OCIBlockStorageVolumeConnection
from common.okitLogging import getLogger

# Configure logging
logger = getLogger()


class OCIBlockStorageVolumes(OCIBlockStorageVolumeConnection):
    def __init__(self, config=None, configfile=None, compartment_id=None, **kwargs):
        self.compartment_id = compartment_id
        self.block_storage_volumes_json = []
        self.block_storage_volumes_obj = []
        super(OCIBlockStorageVolumes, self).__init__(config=config, configfile=configfile)

    def list(self, compartment_id=None, filter=None):
        if compartment_id is None:
            compartment_id = self.compartment_id

        block_storage_volumes = oci.pagination.list_call_get_all_results(self.client.list_vcns, compartment_id=compartment_id).data
        # Convert to Json object
        block_storage_volumes_json = self.toJson(block_storage_volumes)
        logger.debug(str(block_storage_volumes_json))

        # Check if the results should be filtered
        if filter is None:
            self.block_storage_volumes_json = block_storage_volumes_json
        else:
            filtered = block_storage_volumes_json[:]
            for key, val in filter.items():
                filtered = [bs for bs in filtered if re.compile(val).search(bs[key])]
            self.block_storage_volumes_json = filtered
        logger.debug(str(self.block_storage_volumes_json))

        return self.block_storage_volumes_json


class OCIBlockStorageVolume(object):
    def __init__(self, config=None, configfile=None, data=None, **kwargs):
        self.config = config
        self.configfile = configfile
        self.data = data


# Main processing function
def main(argv):

    return


# Main function to kick off processing
if __name__ == "__main__":

```
## Terraform Jinja2 Template
The terraform jinja2 template essentially consists of all actions that would need to occur to create the artifact using
terraform. It will consist of a number of data based statements to convert names to ids as well as the terraform data source.

Finally the Ids (ocids) returned by the data source will be assigned to local variables in a specific format {{resource_name}}_id
this will allow it to be referenced other artifacts. The {{resource_name}} will be generated from the display name into a 
known format.
```jinja2
# -- Copyright: {{ copyright }}
# ---- Author : {{ author }}
# ------ Get List Volume Backup Policies
data "oci_core_volume_backup_policies" "{{ resource_name }}VolumeBackupPolicies" {
}
data "template_file" "{{ resource_name }}VolumeBackupPolicyIds" {
    count    = length(data.oci_core_volume_backup_policies.{{ resource_name }}VolumeBackupPolicies.volume_backup_policies)
    template = data.oci_core_volume_backup_policies.{{ resource_name }}VolumeBackupPolicies.volume_backup_policies[count.index]["id"]
}
data "template_file" "{{ resource_name }}VolumeBackupPolicyNames" {
    count    = length(data.oci_core_volume_backup_policies.{{ resource_name }}VolumeBackupPolicies.volume_backup_policies)
    template = data.oci_core_volume_backup_policies.{{ resource_name }}VolumeBackupPolicies.volume_backup_policies[count.index]["display_name"]
}
data "template_file" "{{ resource_name }}VolumeBackupPolicyIdx" {
    count    = length(data.template_file.{{ resource_name }}VolumeBackupPolicyNames.*.rendered)
    template = index(data.template_file.{{ resource_name }}VolumeBackupPolicyNames.*.rendered, {{ backup_policy }})
}

# ------ Create Internet Gateway
resource "oci_core_volume" "{{ resource_name }}" {
    # Required
    compartment_id = {{ compartment_ocid }}
    availability_domain = data.oci_identity_availability_domains.AvailabilityDomains.availability_domains[{{ availability_domain | default(0) }}]["name"]
    # Optional
    display_name   = {{ display_name }}
    size_in_gbs    = {{ size_in_gbs }}
{% if defined_tags is defined %}
    defined_tags   = {{ defined_tags }}
{% endif %}
{% if freeform_tags is defined %}
    freeform_tags  = {{ freeform_tags }}
{% endif %}
}

locals {
    {{ resource_name }}_id = oci_core_volume.{{ resource_name }}.id
}

# ------ Create Block Storage Backup Policy
resource "oci_core_volume_backup_policy_assignment" "{{ resource_name }}BackupPolicy" {
    asset_id  = local.{{ resource_name }}_id
    policy_id = data.template_file.{{ resource_name }}VolumeBackupPolicyIds.*.rendered[index(data.template_file.{{ resource_name }}VolumeBackupPolicyNames.*.rendered, {{ backup_policy }})]
}

```
## Ansible Jinja2 Template
The ansible jinja2 template consists of all the ansible modules / actions the need to occur to create the artifact using
an ansible playbook. In consists of a number of ansible module statement (note the indentation) that are modified using
jinja2. Because ansible uses jinja2 as its templating language we will see escape sequences for {{ and }} and examples of
this can be found in the various, existing, ansible templates.
```jinja2

# ------ Get List Volume Backup Policies
    - name: Get information of all available volume backup policies
      oci_volume_backup_policy_facts:
      register: {{ resource_name }}VolumeBackupPolicyIds

# ------ Create Block Storage Volume {{ output_name }}
    - name: Create Block Storage Volume {{ output_name }}
      oci_volume:
        state: "present"
        # Required
        compartment_id: "{{ compartment_ocid }}"
        availability_domain: "{{ '{{' }} (AvailabilityDomains.availability_domains | sort(attribute='name') | map(attribute='name') | list)[{{ availability_domain | replace('{{', '') | replace('}}', '') }} | default(1) | int - 1] {{ '}}' }}"
        # Optional
        display_name: "{{ display_name }}"
        size_in_gbs: "{{ size_in_gbs }}"
{% if defined_tags is defined %}
        defined_tags: "{{ defined_tags }}"
{% endif %}
{% if freeform_tags is defined %}
        freeform_tags: "{{ freeform_tags }}"
{% endif %}
      register: {{ resource_name }}

    - set_fact:
        {{ resource_name }}_id: "{{ '{{' }} {{ resource_name }}.volume.id {{ '}}' }}"
        {{ resource_name }}_ocid: "{{ '{{' }} {{ resource_name }}.volume.id {{ '}}' }}"

# ------ Create Block Storage Backup Policy For {{ output_name }}
    - name: Create Volume Backup Policy Assignment {{ output_name }}
      oci_volume_backup_policy_assignment:
        asset_id: "{{ '{{' }} {{ resource_name }}_id {{ '}}' }}"
        policy_id: "{{ '{{' }} ({{ resource_name }}VolumeBackupPolicyIds.volume_backup_policies | selectattr('display_name', 'equalto', {{ backup_policy | replace('{{', '') | replace('}}', '') }}) | map(attribute='id') | list)[0] {{ '}}' }}"
      register: {{ resource_name }}BackupPolicy

``` 
## OKIT Class
The **OkitJson** Class definition with the **okit.js** file will need to be modified to include 3 Methods associated with
the Creation, Getting and Deleting of the new Artifact. The correct locations with the file can be identified from the
comments and the methods are defined in alphabetical order. The Following methods will be created.
### newArtifact
This method will be dynamically called when artifact is dropped on it's target.
```javascript
    // Block Storage Volume
    newBlockStorageVolume(data, parent=null) {
        console.info('New Block Storage Volume');
        this.block_storage_volumes.push(new BlockStorageVolume(data, this, parent));
        return this.block_storage_volumes[this.block_storage_volumes.length - 1];
    }
```
### getArtifact
Used to retrieve the information about a specific artifact. May be called from other artifact.
```javascript
    getBlockStorageVolume(id='') {
        for (let artifact of this.block_storage_volumes) {
            if (artifact.id === id) {
                return artifact;
            }
        }
        return {};
    }
```
### deleteArtifact
This method will be dynamically called when the "delete" is selected from the canvas.
```javascript
    // Block Storage Volume
    deleteBlockStorageVolume(id) {
        for (let i = 0; i < this.block_storage_volumes.length; i++) {
            if (this.block_storage_volumes[i].id === id) {
                this.block_storage_volumes[i].delete();
                this.block_storage_volumes.splice(i, 1);
                break;
            }
        }
    }
```

## Flask Web Designer Python
The main flask python contains all the end points defined for the blueprint and to facilitate querying the @bp.route('/oci/artifacts/<string:artifact>', methods=(['GET'])) 
must be updated to add an additional "elif" clause to create the Artifact facade and execute the list function.

```python
@bp.route('/oci/artifacts/<string:artifact>', methods=(['GET']))
def ociArtifacts(artifact):
    logger.info('Artifact : {0:s}'.format(str(artifact)))
    query_string = request.query_string
    parsed_query_string = urllib.parse.unquote(query_string.decode())
    query_json = standardiseIds(json.loads(parsed_query_string), from_char='-', to_char='.')
    logJson(query_json)
    logger.info(json.dumps(query_json, sort_keys=True, indent=2, separators=(',', ': ')))
    response_json = {}
    if ...........:

    elif artifact == 'BlockStorageVolume':
        logger.info('---- Processing Block Storage Volumes')
        oci_block_storage_volumes = OCIBlockStorageVolumes(compartment_id=query_json['compartment_id'])
        response_json = oci_block_storage_volumes.list(filter=query_json.get('block_storage_volume_filter', None))
    else:
        return '404'

    logger.debug(json.dumps(response_json, sort_keys=True, indent=2, separators=(',', ': ')))
    return json.dumps(standardiseIds(response_json), sort_keys=True)
```

## Connection Facade
The OCI python library should be checked to see if the artifact has a specific client, that does not already exist, and
if so a new Connection class should be created.

```python

class OCIBlockStorageVolumeConnection(OCIConnection):
    def __init__(self, config=None, configfile=None, **kwargs):
        super(OCIBlockStorageVolumeConnection, self).__init__(config=config, configfile=configfile)

def connect(self):
    if self.config is None:
        if self.configfile is None:
            self.config = oci.config.from_file()
        else:
            self.config = oci.config.from_file(self.configfile)
    self.client = oci.core.BlockstorageClient(self.config)
    return
```
## Python OCI Query
## Python Generator
The ociGenerator python code will need to be edited to include a call to render the artifact template. Although the sequence 
in which this occurs does not matter for terraform it does for other language such as ansible, python or bash. Therefore 
the new call needs to be placed before any artifact that will link to / use the new artifact. To this end the calls to 
render have been split into logical sections based on which artifacts they are contained within. In our example the Block
Storage Volume must exist before an Instance can use it hence it occurs before the instance processing.

```python
    def generate(self):
        # Validate input json
        validateVisualiserJson(self.visualiser_json)
        #logger.info('Input JSON : {0:s}'.format(str(self.visualiser_json)))
        # Build the Id to Name Map
        self.buildIdNameMap()
        # Process Provider Connection information
        logger.info("Processing Provider Information")
        jinja2_template = self.jinja2_environment.get_template("provider.jinja2")
        self.create_sequence.append(jinja2_template.render(self.jinja2_variables))
        logger.debug(self.create_sequence[-1])

        # Process Regional Data
        logger.info("Processing Region Information")
        jinja2_template = self.jinja2_environment.get_template("region_data.jinja2")
        self.create_sequence.append(jinja2_template.render(self.jinja2_variables))
        logger.debug(self.create_sequence[-1])

        # Process keys within the input json file
        compartment = self.visualiser_json.get('compartment', self.visualiser_json)
        # - Compartment Sub Components
        # -- Virtual Cloud Networks
        for virtual_cloud_network in self.visualiser_json.get('virtual_cloud_networks', []):
            self.renderVirtualCloudNetwork(virtual_cloud_network)
        # -- Block Storage Volumes
        for block_storage_volume in self.visualiser_json.get('block_storage_volumes', []):
            self.renderBlockStorageVolume(block_storage_volume)

        # - Virtual Cloud Network Sub Components
        # -- Internet Gateways
        for internet_gateway in self.visualiser_json.get('internet_gateways', []):
            self.renderInternetGateway(internet_gateway)
        # -- NAT Gateways
        # -- Dynamic Routing Gateways
        # -- Security Lists
        for security_list in self.visualiser_json.get('security_lists', []):
            self.renderSecurityList(security_list)
        # -- Route Tables
        for route_table in self.visualiser_json.get('route_tables', []):
            self.renderRouteTable(route_table)
        # -- Subnet
        for subnet in self.visualiser_json.get('subnets', []):
            self.renderSubnet(subnet)

        # - Subnet Sub components
        # -- Instances
        for instance in self.visualiser_json.get('instances', []):
            self.renderInstance(instance)
        # -- Loadbalancers
        for loadbalancer in self.visualiser_json.get('load_balancers', []):
            self.renderLoadbalancer(loadbalancer)

        return
```

