#Index

**Modules**

* [periodicjs.ext.scheduled_content](#periodicjs.ext.module_scheduled_content)

**Functions**

* [publishScheduledItemCollectionss()](#publishScheduledItemCollectionss)
  * [publishScheduledItemCollectionss~updateScheduledContent(model, callback)](#publishScheduledItemCollectionss..updateScheduledContent)
 
<a name="periodicjs.ext.module_scheduled_content"></a>
#periodicjs.ext.scheduled_content
An extension that uses cron to periodically check for unpublished posts to publish.

**Params**

- periodic `object` - variable injection of resources from current periodic instance  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="publishScheduledItemCollectionss"></a>
#publishScheduledItemCollectionss()
query mongoose for document that are unpublished and have a publish date that has passed

