#Index

**Modules**

* [periodicjs.ext.serverside_ra](#periodicjs.ext.module_serverside_ra)

**Functions**

* [publishScheduledItemCollectionss()](#publishScheduledItemCollectionss)
  * [publishScheduledItemCollectionss~updateScheduledContent(model, callback)](#publishScheduledItemCollectionss..updateScheduledContent)
 
<a name="periodicjs.ext.module_serverside_ra"></a>
#periodicjs.ext.serverside_ra
An extension that uses cron to periodically check for unpublished posts to publish.

**Params**

- periodic `object` - variable injection of resources from current periodic instance  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="publishScheduledItemCollectionss"></a>
#publishScheduledItemCollectionss()
query mongoose for document that are unpublished and have a publish date that has passed

