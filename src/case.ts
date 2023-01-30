import { CWError } from './error'
const _ = require('lodash')

import { CaseData } from './case_data'
import { CaseFinancial } from './case_financial'
import { CaseWorkflow} from './case_workflow'
import { CaseAdmin } from './case_admin'
import { Comments } from './comments'
import { CaseAssets } from './case_assets'

export class Case {
  /**
   * @hidden
   */
  cw: any


  /**
   * Data Detail methods
   */
  data?: Object
  /**
   * Asset (Address) methods
   */
  assets?: Object
  /**
   * Workflow & task methods
   */
  workflow?: Object
  /**
   * Payment, Receipt, & Fee methods
   */
  financial?: Object
  /**
   * Commenting methods
   */
  comment?: Object
  /**
   * PLL Administration methods
   */
  admin?: Object

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.data = new CaseData(cw)
    this.assets = new CaseAssets(cw)
    this.workflow = new CaseWorkflow(cw)
    this.financial = new CaseFinancial(cw)
    this.comment = new Comments(cw, 'CaObject')
    this.admin = new CaseAdmin(cw)
  }

  /**
   * Create new case
   *
   * @category Cases
   * @param {number} caseTypeId - The case Type ID
   * @param {number} subTypeId - The case subType ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  create(caseTypeId: number, subTypeId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseTypeId: caseTypeId,
        SubTypeId: subTypeId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Case/Create', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Create a child case
   *
   * @category Cases
   * @param {number} busCaseId - The case Type ID
   * @param {number} parentCaObjectId - The case subType ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  createChild(busCaseId: number, parentCaObjectId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        BusCaseId: busCaseId,
        ParentCaObjectId: parentCaObjectId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Case/CreateChild', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Create a case from a Service Request
   *
   * @category Cases
   * @param {number} caseTypeId - The case Type ID
   * @param {number} subTypeId - The case subType ID
   * @param {number} requestId - The service request ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  createFromRequest(caseTypeId: number, subTypeId: number, requestId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseTypeId: caseTypeId,
        SubTypeId: subTypeId,
        ServiceRequestId: requestId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseObject/CreateCaseFromServiceRequest', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update a case
   *
   * @category Cases
   * @param {number} caObjectId - The case Object ID to update
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the updated case
   */
  update(caObjectId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaObjectId: caObjectId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseObject/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cases by IDs
   *
   * @category Cases
   * @param {Array<number>} caObjectIds - The case Object ID to update
   * @return {Object} Returns Promise that represents a collection of objects describing the cases
   */
  getByIds(caObjectIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectIds: caObjectIds
      }
      this.cw.runRequest('Pll/CaseObject/ByIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Cases. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Cases
   * @param {Object} filters - The parameter(s) to search by
   * @return {Object} Returns Promise that represents an Array of case Object IDs
   */
  search(filters: Object) {
    return new Promise((resolve, reject) => {
      var data = filters
      this.cw.runRequest('Pll/CaseObject/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Move a Case point
   *
   * @category Cases
   * @param {string} caObjectId
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include at least WKT _or_ WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated GISPoint
   */
  move(caObjectId: number, x: number, y: number, projection: {WKID?: string, WKT?: string, VcsWKID?: string}, z?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(projection, 'WKID') && !_.has(projection, 'WKT')) {
        // Throw error
        reject(new CWError(1, 'You must provide either the WKID or WKT for the x/y coordinates.', {'projection': projection}))
      }
      var data_init = {
        CaObjectId: caObjectId,
        X: x,
        Y: y
      };
      if(typeof(z)!='undefined') {
        _.set(data_init, 'Z', z)
      }
      var data = _.merge(data_init, projection);
      this.cw.runRequest('Pll/CaseObject/Move', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete case
   *
   * @category Cases
   * @param {number} caObjectId - The case Object ID
   * @return {Object} Returns Promise that represents an object describing the deleted case
   */
  delete(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseObject/DeleteCase', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
