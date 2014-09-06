Jo-fwk
======

How to build
------------

* The included maven POM will build the css and javascript sources on **Eclipse project clean** or similar maven build. 
* The artifacts are build with wro4j, there configuration can be found in src/main/config
*	wro.properties contains the pre- and post-processors goals
	
		preProcessors=lessCss,cssImport
		postProcessors=cssMin,jsMin

*	wro.xml contains the css and js files to process.
	
		<?xml version='1.0' encoding='UTF-8'?>
		<groups xmlns='http://www.isdc.ro/wro'>
		  <group name='jo-flattery'>
		    <css>/fwk/css/flattery/jo-flattery.less</css>
		    <js>/fwk/js/core/log.js</js>
		    <js>/fwk/js/core/_jo.js</js> 
		    <js>/fwk/js/core/dom.js</js>
		    <js>/fwk/js/core/event.js</js>
		    <js>/fwk/js/core/subject.js</js>
		    <js>/fwk/js/core/time.js</js> 
		    <js>/fwk/js/core/yield.js</js> 
		    <js>/fwk/js/core/cache.js</js>
		    <js>/fwk/js/core/clipboard.js</js>
		    <js>/fwk/js/core/local.js</js> 
		    <js>/fwk/js/core/timer.js</js> 
		    <js>/fwk/js/core/queue.js</js>
		    <js>/fwk/js/data/datasource.js</js>
		    <js>/fwk/js/data/record.js</js>
		    <js>/fwk/js/data/database.js</js>
		    <js>/fwk/js/data/filesource.js</js>
		    <js>/fwk/js/data/sqldatasource.js</js>
		    <js>/fwk/js/data/script.js</js>
		    <js>/fwk/js/data/preference.js</js>
		    <js>/fwk/js/data/yql.js</js>
		    <js>/fwk/js/data/dispatch.js</js>
		    <js>/fwk/js/data/template.js</js>
		    <js>/fwk/js/ui/collect.js</js>
		    <js>/fwk/js/ui/interface.js</js>
		    <js>/fwk/js/ui/view.js</js>
		    <js>/fwk/js/ui/container.js</js>
		    <js>/fwk/js/ui/control.js</js>
		    <js>/fwk/js/ui/button.js</js>
		    <js>/fwk/js/ui/list.js</js>
		    <js>/fwk/js/ui/busy.js</js>
		    <js>/fwk/js/ui/caption.js</js>
		    <js>/fwk/js/ui/card.js</js>
		    <js>/fwk/js/ui/stack.js</js>
		    <js>/fwk/js/ui/scroller.js</js>
		    <js>/fwk/js/ui/divider.js</js>
		    <js>/fwk/js/ui/expando.js</js>
		    <js>/fwk/js/ui/expandotitle.js</js>
		    <js>/fwk/js/ui/flexrow.js</js>
		    <js>/fwk/js/ui/focus.js</js>
		    <js>/fwk/js/ui/footer.js</js>
		    <js>/fwk/js/ui/gesture.js</js>
		    <js>/fwk/js/ui/group.js</js>
		    <js>/fwk/js/ui/html.js</js>
		    <js>/fwk/js/ui/input.js</js>
		    <js>/fwk/js/ui/label.js</js>
		    <js>/fwk/js/ui/menu.js</js>
		    <js>/fwk/js/ui/option.js</js>
		    <js>/fwk/js/ui/passwordinput.js</js>
		    <js>/fwk/js/ui/popup.js</js>
		    <js>/fwk/js/ui/screen.js</js>
		    <js>/fwk/js/ui/shim.js</js>
		    <js>/fwk/js/ui/sound.js</js>
		    <js>/fwk/js/ui/stackscroller.js</js>
		    <js>/fwk/js/ui/tabbar.js</js>
		    <js>/fwk/js/ui/table.js</js>
		    <js>/fwk/js/ui/textarea.js</js>
		    <js>/fwk/js/ui/title.js</js>
		    <js>/fwk/js/ui/toolbar.js</js>
		    <js>/fwk/js/ui/form.js</js>
		    <js>/fwk/js/ui/dialog.js</js>
		    <js>/fwk/js/ui/selectlist.js</js>
		    <js>/fwk/js/ui/navbar.js</js>
		    <js>/fwk/js/ui/select.js</js>
		    <js>/fwk/js/ui/toggle.js</js>
		    <js>/fwk/js/ui/slider.js</js>
		    <js>/fwk/js/ui/image.js</js>
		    <js>/fwk/js/ui/canvas.js</js>
		  </group>
		</groups>
		
* The POM file defines the input- and output-folders.

		<configuration>
		    <wroManagerFactory>ro.isdc.wro.maven.plugin.manager.factory.ConfigurableWroManagerFactory</wroManagerFactory>
		    <wroFile>${basedir}/src/main/config/wro.xml</wroFile>
		    <extraConfigFile>${basedir}/src/main/config/wro.properties</extraConfigFile>
		    <targetGroups>jo-flattery</targetGroups>
		    <cssDestinationFolder>${project.build.directory}/${project.build.finalName}/style/</cssDestinationFolder>
		    <jsDestinationFolder>${project.build.directory}/${project.build.finalName}/script/</jsDestinationFolder>
		    <!-- <contextFolder>${basedir}/src/main/webapp/</contextFolder> -->
		    <contextFolder>${basedir}</contextFolder>
		    <ignoreMissingResources>false</ignoreMissingResources>
	    </configuration>

* JsDoc (3) documentation 

	* Configuration
	
			<plugin>
				<groupId>com.phasebash.jsdoc</groupId>
				<artifactId>jsdoc3-maven-plugin</artifactId>
				<version>1.1.0</version>
				<configuration>
					<recursive>true</recursive>
					<directoryRoots>
						<directoryRoot>${basedir}/fwk/js</directoryRoot>
					</directoryRoots>
					<sourceFiles>
        				<sourceFile>${basedir}/fwk/README.md</sourceFile>
    				</sourceFiles>
				</configuration>
			</plugin>
			
	* Output ${project.build.directory}/${project.build.finalName}/jsdoc
			
See [[https://github.com/phasebash/jsdoc3-maven-plugin]]


		
		